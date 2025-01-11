const mongoose = require("mongoose");

const seekercomplaintSchema=mongoose.Schema({
    complaintid:{type:Number},
    seekerid:{type:Number},
    email:{type:String},
    complaint_title:{type:String},
    complaint_details:{type:String},
})

seekercomplaintSchema.pre('save',function(next){
    if(!this.complaintid){
        this.complaintid=Math.floor(Date.now());
    }
    next();
})

const seekercomplaints=mongoose.model("seekercomplaints",seekercomplaintSchema)

module.exports={
    seekercomplaints
}