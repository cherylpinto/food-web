const jwt=require("jsonwebtoken");
const {createError}=require("../error");
const secret = process.env.JWT || "yesitsme";

async function verifyToken(req,res,next){
    try{
        if(!req.headers['authorization'])
        {
            return next(createError(401,"Yor are not authenticated"));
        }
       const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            return next(createError(401,"Yor are not authenticated"));
        }
        const user=jwt.verify(token,secret);
        req.user=user;
        return next();
    }catch(err){
        next(err);
    }
}
module.exports={
    verifyToken,
}