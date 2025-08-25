import User from "../model/User.js";
import FriendRequest from "../model/FriendRequest.js"
export async function getRecommandedUsers(req, res) {
 try {
    const userId = req.user._id;
    const currentUser = req.user;
   
   
   
   
    const recommendedUsers=await User.find(
       {
           $and: [
               { _id: { $ne: userId } }, // Exclude current user
               { _id: { $nin: currentUser.friends } }, // Exclude friends
               {isOnboarded: true} // Only include onboarded users
           ]
       }
    )
    res.status(200).json(recommendedUsers)
 } catch (error) {
    console.error("Error fetching recommended users:", error.message);
    return res.status(500).json({ message: "Internal server error" });
 }

}
export async function getMyFriends(req,res){
 try {
   const user=await User.findById(req.user._id).select("friends").populate("friends",
      "fullName profilePic nativeLanguage learningLanguage");

      res.status(200).json(user.friends);
 } catch (error) {
   console.error("Error int getMyFriends controller");
   res.status(500).json({message:"Internal server error"});
 }
}
export async function sendFriendRequest(req,res){
   try {
      const myId=req.user._id;
      const {id:recipientId}=req.params;
      //prevent request to self
      if(myId===recipientId){
         return res.status(400).json({message:"You cannot send friend request to yourself"});
      }
      const recipient=await User.findById(recipientId);
      if(!recipient){
         return res.status(404).json({message:"Receipient not found"});
      }
      if(recipient.friends.includes(myId)){
         return res.status(400).json({message:"You are already friends"});
      }
      const existingrequest=await FriendRequest.findOne({
         $or:[
            {sender:myId,recipient:recipientId},
            {sender:recipientId,recipient:myId}
         ]
      })
      if(existingrequest){
         return res.status(400).json({message:"A friend request already exist between you and this user"});
      }
      const friendRequest=await FriendRequest.create({
         sender:myId,
         recipient:recipientId,
      });
      res.status(201).json(friendRequest);

   } catch (error) {
      console.error("Error in sendFriendRequest controller",error.message);
      res.status(500).json({message:"Internal server error"});
   }
}
export async function acceptFriendRequest(req,res){
   try {
      const {id:requestId}=req.params;
      const friendRequest=await FriendRequest.findById(requestId);
      if(!friendRequest){
         return res.status(404).json({message:"Friend request not found"});
      }
      if(friendRequest.recipient.toString()!==req.user.id){
         return res.status(403).json({messgae:"you are not authorized to accept this request"});
      }
      friendRequest.status="accepted";
      await friendRequest.save();

      await User.findByIdAndUpdate(friendRequest.sender,{
         $addToSet: {friends: friendRequest.recipient}
      });
      await User.findByIdAndUpdate(friendRequest.recipient,{
         $addToSet: {friends: friendRequest.sender}
      });
      res.status(200).json({message:"Friend reuqest accepted"});
   } catch (error) {
      console.error("error in acceptFriendRequest Controller",error);
      return res.status(500).json({message:"Internal server error"});
   }
}

export async function getFriendRequests(req,res){
   try {
      const incomingReqs=await FriendRequest.find({
         recipient:req.user.id,
         status:"pending"
      }).populate("sender","fullName profilePic nativeLanguage learningLanguage");
      
      const acceptedReqs=await FriendRequest.find({
         recipient:req.user.id,
         status:"accepted"
      }).populate("sender","fullName profilePic");
      
      res.status(200).json({incomingReqs,acceptedReqs});
   } catch (error) {
      console.error("error in getFriendRequest controller",error);
      return res.status(500).json({message:"Internal server error"});
   }
}
export async function getOutgoingFriendReqs(req,res){
   try {
      const outgoingReqs=await FriendRequest.find({
         sender:req.user.id,
         status:"pending"
      }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
     
      res.status(200).json(outgoingReqs);
   } catch (error) {
      console.error("Error in getOutgoingFriendReqs controller",error);
      res.status(500).json({message:"Internal server error"});
   }
}