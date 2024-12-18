const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userAuth = async(req,res,next) =>{
    try{
        const {token} = req.cookies
        if(!token){
            throw new Error("The token is invalid")
        }
        const decodeMessage = await jwt.verify(token,"DEV@Tinder$790");
        const{_id} = decodeMessage
        if(!_id){
            return res.status(401).json({ error: "Invalid token ID" });
        }
         const user = await User.findById(_id);
         if(!user){
            return res.status(404).json({ error: "User not found" });
         }
         req.user = user
         
        next()
    }catch(err){
        res.status(401).send({error:err.message})
    }

}
 
module.exports ={userAuth};