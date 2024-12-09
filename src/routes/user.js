const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

userRouter.get("/user/requests/received",userAuth,async(req,res) =>{
    try{
        const loggedInUser = req.user;
        const USER_DATA = ["firstName","lastName","age","description","skills"];
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_DATA)
        if(!connectionRequest){
            res.send("Empty recieved request");
        }

        res.status(200).send(connectionRequest)

    }catch(err){
        res.status(400).send("Error "+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res) =>{
    try{
        const loggedInUser = req.user;
        const USER_DATA = ["firstName","lastName","age","description","skills"];
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",USER_DATA).populate("toUserId",USER_DATA);
        
        const data = connectionRequest.map(row =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString() ){
                return row.toUserId;
            }
            return row.fromUserId
        })
        res.status(200).json({data});
    }catch(err){
        res.status(400).send("Error "+err.message);
    }

})

userRouter.get("/user/feed",userAuth,async(req,res) =>{
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
     limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit
    const USER_DATA = ["firstName","lastName","age","description","skills"];
    const connectionRequest = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ]
    })

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach(req =>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    })

    const users = await User.find({
        $and:[
            {_id:{$nin:Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}}
        ]
    }).select(USER_DATA).skip(skip).limit(limit);

    res.send(users)



})



module.exports = userRouter;