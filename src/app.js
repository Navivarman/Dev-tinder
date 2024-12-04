const express = require('express');
const {connectDB} = require('./config/database')
const User = require('./models/user');
const validator = require('validator')
const { validateSingup } = require('./utils/validate');
const bcrypt = require('bcrypt')
const app = express();
app.use(express.json())
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser()) 
const{userAuth} = require('./middlewares/auth');
app.post("/signup", async(req,res) =>{
    
    try{
        validateSingup(req)
        const {firstName,lastName,email,password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({firstName,lastName,email,password:passwordHash})
        await user.save();
        const token = await jwt.sign({_id : user._id},"DEV@Tinder$790",{expiresIn : "7d"})
        res.cookie("token",token,{expires : new Date(Date.now() + 900000)})
        res.send("Successfully posted")

        /* const ALLOEWED_POSTFIELDS = ["firstName","lastName","email","password","gender","age","skills"];
        const isAllowedPost = Object.keys(data).every(k => ALLOEWED_POSTFIELDS.includes(k))
        console.log(isAllowedPost)
        if(isAllowedPost & data?.skills.length < 5){

        await user.save();
        res.send("Successfully posted")
        }else{
            res.status(400).send("Invalid request")
        }
 */
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

app.get("/profile",userAuth ,async(req,res) =>{
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

app.post("/sendRequest",userAuth,async(req,res) =>{
    const user = req.user
    res.send(user.firstName+" sent the request")
})

app.post("/login",async(req,res) =>{
    const {email,password} = req.body;
    if(!validator.isEmail(email)){
        throw new Error("Invalid email")
    }
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error("User not found")
    }
    const isValidPassword = await bcrypt.compare(password,user.password)
    if(!isValidPassword){
        throw new Error("Invalid password")
    }
    res.send("Login Success")
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
    const Id = req.body.userId;

    try{
        const data = req.body;
        const ALLOWED_PATCHFIELDS = ["age"]
            const isAllowed = Object.keys(data).every(key => ALLOWED_PATCHFIELDS.includes(key));
            console.log(isAllowed)
            if(!isAllowed){
                const user = await User.findByIdAndUpdate(Id,data,{runValidators: true});
                res.send("User updated");
            }

    }catch(err){
       /*  res.status(404).send("Something went wrong") */
       if(err.name == "Validation Error"){
        const errorMessages = Object.values(err.errors).map(error => error.message)
        res.status(400).send({error : "Validation Error",message : errorMessages});
       }
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

