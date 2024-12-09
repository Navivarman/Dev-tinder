


app.get("/user",async(req,res) =>{
    try{
        const userEmail = req.body.email;
        const userId =  await User.findOne({email : userEmail});
        res.send(userId)
    }catch(err){
        res.status(400).send("Something went wrong")
    }

})
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
