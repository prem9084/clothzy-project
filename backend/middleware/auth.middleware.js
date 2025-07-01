import  jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
export const isAuth = async(req, res, next) => {
    try {
       const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

       if (!token) {
           return res.status(401).json({ message: "Unauthorized" });
       }
       const decoded  = await jwt.verify(token, process.env.JWT_SECRET);

       const user = await userModel.findById(decoded._id).select("-password");

       req.user = user;
       next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized" });
        
    }
}