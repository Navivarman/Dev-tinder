const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

userRouter.get("/user/requests/received",userAuth,async(req,res) =>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","age","description","skills"])
        if(!connectionRequest){
            res.send("Empty recieved request");
        }

        res.status(200).send(connectionRequest)

    }catch(err){
        res.status(400).send("Error "+err.message)
    }
})



module.exports = userRouter;