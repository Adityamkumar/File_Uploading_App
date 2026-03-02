import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken;

     try {
           if(!token){
        return res.status(401).json({
            message: "Unauthorized access"
        })
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await userModel.findById(decoded._id).select('-password')

    if(!user){
         return res.status(401).json({
            message: "Invalid token"
         })
    }

    req.user = user;
    next()
     } catch (err) {
        return res.status(401).json({
             message: "Invalid token"
        })
     }
}