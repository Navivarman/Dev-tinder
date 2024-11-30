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
app.listen(7777);