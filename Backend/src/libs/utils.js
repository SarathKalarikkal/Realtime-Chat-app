import jwt from 'jsonwebtoken';


export const generateJwtToken=(userId,res)=>{

const token = jwt.sign({userId},process.env.JWT_SECRETE,{expiresIn:'5d'})

res.cookie("jwt",token,{
    MaxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    httpOnly:true,
    sameSite:"strict",
    secured:process.env.NODE_ENV !== "development",
})

return token

}