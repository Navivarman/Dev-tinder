const express = require('express');
const {adminAuth,userAuth} = require('./middlewares/auth');
const app = express();

app.use("/user/data",userAuth,(req,res,) =>{
        res.send("User data is sent")
})
app.use("/admin/getAllData",adminAuth,(req,res) =>{
    res.send("Admin data is sent");
})
app.use("/user/login",(req,res) =>{
    res.send("User login is sent");
})


app.use("/test",(req,res) =>{
    try{
        throw new Error("Test error");
        res.send("successful")
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

app.use("/",(err,req,res,next) =>{
    if(err){
        res.status(500).send("Something went wrong");
    }
})


app.listen(7777);