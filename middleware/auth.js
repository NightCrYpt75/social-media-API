const CustomAPIError=require('../errors/custom-error')
const jwt=require('jsonwebtoken')
const User=require('../models/User')

const authenticationMiddleware=async (req,res,next)=>{

    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
    {
        throw new CustomAPIError('NO token provided',401)
    }
    const token=authHeader.split(' ')[1];
    //console.log(authHeader)
    try {
       
         const decoded=jwt.verify(token,process.env.JWT_SECRET)
         //console.log(decoded)
        const {email}=decoded
         req.user=email
         next()
       
    
    } catch (error) {
        throw new CustomAPIError('NOT authorized to access this route',401)   
    }
    
    
}

module.exports=authenticationMiddleware