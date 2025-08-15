import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protectRoute=async (req, res, next)=>{
 try {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({message:"Unauthorized! Please login first"});
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
        return res.status(401).json({message:"Invalid token! Please login again"});
    }
    const user = await User.findById(decode.userId);
    if (!user) {
        return res.status(404).json({message:"User not found! Please signup again"});
    }
    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler

 } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({message:"Internal Server Error"});
    
 }
}