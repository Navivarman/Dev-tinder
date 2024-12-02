const express = require('express');
const {connectDB} = require('./config/database')
const User = require('./models/user');
const app = express();
app.use(express.json())
app.post("/signup", async(req,res) =>{
    const user = new User(req.body)
    console.log(user)
    try{
        await user.save();
        res.send("Successfully posted")
    }catch(err){
        res.status(404).send("Error :"+ err.getMessage)
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

app.delete("/delete", async(req,res) =>{
    try{
            const Id = req.body.userId;
             const user = await User.findByIdAndDelete(Id);
            res.send("User deleted");
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})

app.patch("/update",async(req,res) =>{
    try{
            const Id = req.body.userId;
            const data = req.body;
            console.log(data);
            const user = await User.findByIdAndUpdate(Id,data,{runValidators: true});
            res.send("User updated");
    }catch(err){
        res.status(404).send("Something went wrong")
    }
})

})
connectDB().then(() =>{
    console.log("Database is connected successfully");
    app.listen(7777,() =>{
        console.log("Server is running on port 7777");
    });
}).catch((err) =>{
    console.log(err);
})

