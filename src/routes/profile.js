const express = require('express');
const profileRouter = express.Router();
const{userAuth} = require('../middlewares/auth');
const {validateEditFields} = require('../utils/validate');
const User = require('../models/user');

profileRouter.get("/profile/view",userAuth ,async(req,res) =>{
    try{
        const user = req.user
        res.send(user)
    }catch(err){
        if(err.name == "ValidationError"){
            const errorMessages = Object.values(err.errors).map(e => e.message )
            res.status(400).send({ error: "Validation Error", messages: errorMessages });
        }else{
            res.status(500).send({ error: "Internal server error", message : err.message });
        }
    }
})

profileRouter.patch('/profile/edit',userAuth,async(req,res) =>{
    try{
        if(!validateEditFields(req.body)){
            throw new Error("Invalid update fields")
        }
        const user = req.user 
        Object.keys(req.body).forEach(key => user[key] = req.body[key])
        await user.save();
        res.send(`${user.firstName} updated successfully`)
    }catch(err){
        res.status(400).json({ error: err.message });
    }
})

profileRouter.get("/feed",async(req,res) =>{
    try{
        const userEmail = req.body.email;
        const userId =  await User.find({});
        res.send(userId)
    }catch(err){
        res.status(400).send("Something went wrong")
    }

})

module.exports = profileRouter;