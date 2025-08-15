import { upsertUser } from "../lib/stream.js";
import User from "../model/User.js"
import jwt from "jsonwebtoken"
export async function signup(req,res){
   const {email,password,fullName}=req.body;
   try {
    if(!email || !password || !fullName){
        return res.status(400).json({message:"All Fields are Required"});
    }

    if(password.length<6)
        return res.status(400).json({message:"Password must be of at least 6 characters"});
   
   const existingUser=await User.findOne({email});
   if(existingUser){
      return res.status(400).json({message:"Email already exists! Use Different One"});
   }

   const idx=Math.floor(Math.random()*100)+1;
   const randomAvatar=`https://avatar.com.iran.liara.run/public/${idx}.png`;
   const newUser=await User.create({
    email,
    fullName,
    password,
    profilePic:randomAvatar,
   })
   try {
    await upsertUser(
     {
       id:newUser._id.toString(),
       name:newUser.fullName,
       image:newUser.profilePic || ""
     }
    )
    console.log(`User named ${fullName} upserted in Stream successfully`);
   } catch (error) {
    console.log("Error upserting user in Stream:", error);
   }
   const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});
   res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE_ENV==="production" ? true : false,
   })
   res.status(201).json({success:true,user:newUser});
}
   catch (error) {
    console.log("Error in signup controller",error);
    res.status(500).json({message:"Internal Server Error"});
   }
}



export async function login(req,res){
    const {email,password}=req.body;
    try {
        if(!email || !password){
            return res.status(400).json({message:"All Fields are Required!"});
        }
        const existingUser=await User.findOne({email});
        if(!existingUser){
             res.status(400).json({message:"No Account existed for this email  !"});
             return;
        }
        
        if(password!=existingUser.password){
            res.status(400).json({message:"Please enter the correct password!"});
            return;
        }
         const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

        res.status(200).json({message:`Hi ${existingUser.fullName} you have successfully logged in!`});
        
    } catch (error) {
        console.log("Error in login controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export function logout(req,res){
    res.clearCookie("jwt");
    res.status(200).json({message:"You have successfully logged out!"});
}

export async function onboard(req,res){
    try {
        const userId=req.user._id;
        const {fullName,bio,nativeLanguage,learningLanguage,location}=req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message:"All Fields are Required!",
                missingFields:[
                    !fullName ? "fullName" : null,
                    !bio ? "bio" : null,
                    !nativeLanguage ? "nativeLanguage" : null,
                    !learningLanguage ? "learningLanguage" : null,
                    !location ? "location" : null
                ]
            });
        }
        const updatedUser=await User.findByIdAndUpdate(userId,{
           ...req.body,
            isOnboarded:true
        },{new:true});
        if(!updatedUser){
            return res.status(404).json({message:"User not found!"});
        }
        res.status(200).json({message:"User onboarded successfully!",
            user:updatedUser})
        
        try {
            await upsertUser(
                {
                    id:updatedUser._id.toString(),
                    name:updatedUser.fullName,
                    image:updatedUser.profilePic || ""
                }
            )
            console.log(`User named ${updatedUser.fullName} Updated in Stream successfully`);
        } catch (error) {
            console.log("Error upserting user in Stream:", error);
        }

    } catch (error) {
        console.log("Error in onboarding controller",error);
        res.status(500).json({message:"Internal Server Error"});
        
    }
}
