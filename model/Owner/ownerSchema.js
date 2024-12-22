const mongoose=require("mongoose");

const ownerSchema=mongoose.Schema({
    name:{type:String},
    lastname:{type:String},
    email:{type:String,unique:true},
    phonenumber:{type:String},
    password:{type:String},
})

const owners=mongoose.model("owners",ownerSchema)

module.exports={
    owners
};