const express = require('express');
const {connectDB} = require('./config/database')
const User = require('./models/User');
const app = express();
app.post("/signup", async(req,res) =>{
    const user = new User({
        firstName:"Navi",
        lastName:"Varman",
        email:"navi@gmail.com",
        password:"123456",
         })
    try{
        await user.save();
        res.send("Successfully posted")
    }catch(err){
        res.status(400).send("Error :",err)
    }
})
connectDB().then(() =>{
    console.log("Database is connected successfully");
    app.listen(7777,() =>{
        console.log("Server is running on port 7777");
    });
}).catch((err) =>{
    console.log("Error in connecting to the database");
})

