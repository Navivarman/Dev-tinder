const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required : true,
        trim : true,
        minLength:4
    },
    lastName:{
        type : String,
        trim:true
    },
    email:{
        type : String,
        required : true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password must be at least 8 characters long, and must contain at least');
            }
        }
    },
    age:{
        type : Number,
        min:18
    },
    gender:{
        type : String,
        enum : ["male","female","others"],
        message : "Invalid gender"
    },
    description:{
        type:String,
        default : "This is the default description"
    },
    skills:{
        type : [String],
    }
},
{
    timestamps : true
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id : user._id},"DEV@Tinder$790",{expiresIn : "7d"})
    return token
}

userSchema.methods.validatePassword =  async function(passwordByUser){
    const user = this;
    const passwordHash = user.password
    const isValid = await bcrypt.compare(passwordByUser,passwordHash)
    return isValid;
}

module.exports =mongoose.model("User",userSchema);