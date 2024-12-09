const mongoose = require('mongoose');

const connectRequestSchema = new mongoose.Schema({
    fromUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
         ref : "User"
    },
    status:{
        type : String,
        enum :{
            values: ["interested","ignored","accepted","rejected"],
            message : `{VALUE} is invalid status`
        }

    }
},{timestamps : true}
)
connectRequestSchema.pre('save',function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error(" Connection Request dont send to yourself ");
    }
    next();
})

const connectRequestModel = new mongoose.model("connectRequest",connectRequestSchema);
module.exports = connectRequestModel;