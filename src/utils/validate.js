const validator = require('validator')
const validateSingup = (req) =>{
    const {firstName,lastName,email,password} = req.body;
    if(firstName.length < 3 ){
        throw new Error('First name must be at least 4 characters long');
    }
    else if(lastName.length < 3 ){
        throw new Error('First name must be at least 4 characters long');
    }
    else if(!validator.isEmail(email)){
        throw new Error('Email is not valid')
    }
    else if(!validator.isStrongPassword(password,)){
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase')
    }
}

const validateEditFields = (req) =>{
    try{
        const allowedFields = ["firstName","lastName","description","skills"]
        const isAllowedFields = Object.keys(req.body).every((fields) => allowedFields.includes(fields))
        return isAllowedFields
    }catch(err){
        res.status(402).send("error");
    }
 
}

module.exports = {validateSingup , validateEditFields};