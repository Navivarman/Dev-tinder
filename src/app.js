const express = require('express');
const {connectDB} = require('./config/database')
const User = require('./models/user');
const app = express();
app.use(express.json())
app.post("/signup", async(req,res) =>{
    const user = new User(req.body)
    try{
        await user.save();
        res.send("Successfully posted")
    }catch(err){
        res.status(400).send("Error :",err)
    }
})

app.get("/user",async(req,res) =>{
    try{
        const userEmail = req.body.email;
        const userId =  await User.findOne({email : userEmail});
        res.send(userId)
    }catch(err){
        res.status(400).send("Something went wrong")
    }

})
app.get("/feed",async(req,res) =>{
    try{
        const userEmail = req.body.email;
        const userId =  await User.find({});
        res.send(userId)
    }catch(err){
        res.status(400).send("Something went wrong")
    }

})
connectDB().then(() =>{
    console.log("Database is connected successfully");
    app.listen(7777,() =>{
        console.log("Server is running on port 7777");
    });
}).catch((err) =>{
    console.log(err);
})

