import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async(req,res,next)=>{

    try{
        const token = req.cookies.jwt

    if(!token){
        res.status(401).json({message:"Unauthorized, no token"})
    }

    const decodedTOken = jwt.verify(token,process.env.JWT_SECRETE)

    if(!decodedTOken){
        res.status(401).json({message:"Unauthorized, invalid token"})
    }

    const user = await User.findById(decodedTOken.userId).select("-password")

    if(!user){
        res.status(401).json({message:"User not found"})
    }

    req.user =user

    next()
    }catch(error){
        console.log(error.message)  
        return res.status(500).json({message:"Internal server error"})
    }   
}

