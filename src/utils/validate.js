const validator = require('validator')
const validateSingup = (req) =>{
    const {firstName,lastName,email,password} = req.body;
    if(firstName.length < 4 ){
        throw new Error('First name must be at least 4 characters long');
    }
    else if(!validator.isEmail(email)){
        throw new Error('Email is not valid')
    }
    else if(!validator.isStrongPassword(password,)){
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase')
    }
}

module.exports = {validateSingup};