const mongoose = require("mongoose");

const ownercomplaintSchema=mongoose.Schema({
    complaintid:{type:Number},
    ownerid:{type:Number},
    email:{type:String},
    complaint_title:{type:String},
    complaint_details:{type:String},
})

ownercomplaintSchema.pre('save',function(next){
    if(!this.complaintid){
        this.complaintid=Math.floor(Date.now());
    }
    next();
})

const ownercomplaints=mongoose.model("ownercomplaints",ownercomplaintSchema)

module.exports={
    ownercomplaints
}