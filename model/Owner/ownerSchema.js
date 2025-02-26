const mongoose=require("mongoose");

const ownerSchema=mongoose.Schema({
    ownerid:{type:Number},
    name:{type:String},
    lastname:{type:String},
    email:{type:String,unique:true},
    phonenumber:{type:String},
    password:{type:String},
    address: {
        street: { type: String },
        city: { type: String,default:"Belgaum"},
        state: { type: String,default:"Karnataka" },
        zipcode: { type: String },
    },
    profilepicture:{type:String},
    blocked:{type:Boolean,default:false}
})

ownerSchema.pre('save', function(next) {
    if (!this.ownerid) {
        this.ownerid = Math.floor(Date.now());  // Using Unix timestamp for unique ID
    }
    next();
});

const owners=mongoose.model("owners",ownerSchema)

module.exports={
    owners
};