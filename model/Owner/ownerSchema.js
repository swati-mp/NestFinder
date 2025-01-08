const mongoose=require("mongoose");

const ownerSchema=mongoose.Schema({
    ownerid:{type:Number},
    name:{type:String},
    lastname:{type:String},
    email:{type:String,unique:true},
    phonenumber:{type:String},
    password:{type:String},
    profilepicture:{type:String}
})

ownerSchema.pre('save', function(next) {
    if (!this.ownerid) {
        this.ownerid = Math.floor(Date.now() / 1000);  // Using Unix timestamp for unique ID
    }
    next();
});

const owners=mongoose.model("owners",ownerSchema)

module.exports={
    owners
};