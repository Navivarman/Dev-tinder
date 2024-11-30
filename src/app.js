const express = require('express');
const app = express();

app.get("/test",(req,res) =>{
    res.send({firstname:"navi" ,lastname:"varman"})
})
app.post("/test",(req,res) =>{
    res.send("POST is successfully executed")
})
app.patch("/test",(req,res) =>{
    res.send("PATCH is successfully executed")
})
app.put("/test",(req,res) =>{
    res.send("PUT is successfully executed")
})
app.delete("/test",(req,res) =>{
    res.send("DELETE is successfully executed")
})
app.use("/test",(req,res) =>{
    res.send("Hello Test ");
})

app.use('/hello',(req,res) =>{
    res.send("Hello Hello");
})
app.use('/',(req,res) =>{
    res.send("Hello Home page");
})
app.listen(7777);