const express = require('express');
const authRouter = express.Router();
const { validateSingup } = require('../utils/validate');
const User = require('../models/user');
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

authRouter.post("/signup", async(req,res) =>{
    
    try{
        validateSingup(req)
        const {firstName,lastName,email,password,description,skills} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({firstName,lastName,email,password:passwordHash,description,skills})
        await user.save();
  
        res.send("Successfully Singnup")
    }catch(err){
               console.error(err); 
        if (err.name === "ValidationError") {
            const errorMessages = Object.values(err.errors).map(e => e.message);
            res.status(400).send({ error: "Validation Error", messages: errorMessages });
        } else {
            res.status(500).send({ error: "Internal Server Error", message: err.message });
        }
    }
}) 

authRouter.post("/login",async(req,res) =>{
    try{
        const {email,password} = req.body;
        if(!validator.isEmail(email)){
            throw new Error("Invalid email")
        }
        const user = await User.findOne({email:email})
        if(!user){
            throw new Error("User not found")
        }
        const isValidPassword = await user.validatePassword(password);
        if(!isValidPassword){
            throw new Error("Invalid password")
        }
        const token = await jwt.sign({_id : user._id},"DEV@Tinder$790",{expiresIn : "7d"})
        res.cookie("token",token,{expires : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}).send("Login Success")
    }catch(err){
        res.send("Error "+err.message)
    }

})

authRouter.post("/logout",(req,res) =>{
    res.cookie("token",null,{expires: new Date(Date.now())}).send("Logout Success")
})


module.exports = authRouter;