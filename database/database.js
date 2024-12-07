const mongoose=require("mongoose");

const MONGO_URI=process.env.MONGO_URI;

const database=mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("Successfully connected to database")
}).catch((e)=>{
    console.log(`could not connect: ${e}`)
})

module.exports=database;