const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth')
const ConnectionRequest= require('../models/connectionRequest')
const User = require('../models/user')


requestRouter.post("/request/send/:status/:userId", userAuth, async(req,res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
    
        const connectionRequest = await ConnectionRequest({
            fromUserId,toUserId,status
        })
        const allowedStatus = ["interested","ignored"]
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type: " + status);
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("User not found");
        }
        const existingConnectionRequest =await ConnectionRequest.findOne(
            {
            $or:[
                {fromUserId:fromUserId,toUserId:toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
            })
        if(existingConnectionRequest){
            throw new Error("Connection request already exists");
        }
        const data = await connectionRequest.save();
        res.json({
            message : "Request is send successfully",
            data
        })
    }catch(err){
        res.status(400).json({
            message : "Error "+err.message,
        })
    }

})

requestRouter.post("/request/review/:status/:userId",userAuth,async(req,res) =>{
    try{
        const{status,userId} = req.params;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type: " + status);
        }
        const loggedInUser = req.user;
        

        const connectionRequest = await ConnectionRequest.findOne({
            fromUserId:userId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!connectionRequest){
            return res
            .status(404)
            .json({ message: "Connection request not found" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message :"Successfully updated",
            data
        })

    }catch(err){
        res.status(400).json({message:err.message});
    }
}) 


      
requestRouter.post("/sendRequest",userAuth,async(req,res) =>{
    const user = req.user
    res.send(user.firstName+" sent the request")
})

module.exports = requestRouter;