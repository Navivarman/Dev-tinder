const userAuth = (req,res,next) =>{
    const userId = "navi";
    const isUserVerified = userId ==="navi";
    if(!isUserVerified){
        res.status(401).send("Unauthorized request");
    }else{
        next();
    }
}
const adminAuth = (req,res,next) =>{
    const userId = "navi";
    const isUserVerified = userId ==="navi";
    if(!isUserVerified){
        res.status(401).send("Unauthorized request");
    }else{
        next();
    }
}

module.exports ={userAuth,adminAuth};