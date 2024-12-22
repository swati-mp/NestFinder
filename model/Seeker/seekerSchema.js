const mongoose=require("mongoose");

const seekerSchema=mongoose.Schema({
    name:{type:String},
    lastname:{type:String},
    email:{type:String,unique:true},
    phonenumber:{type:String},
    password:{type:String},
})

const seekers=mongoose.model("seekers",seekerSchema)

module.exports={
    seekers
};