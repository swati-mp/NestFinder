const { seekers } = require("../../model/Seeker/seekerSchema")

const getBlockSeeker=async (req,res)=>{
    try {
        const seekerlist=await seekers.find({blocked:false}) 
        res.render("blockseeker",{
            adminname:process.env.Admin_Name,
            seekerlist:seekerlist
        })
    } catch (error) {
        console.log(error)
    }  
}

const postBlockSeeker=async (req,res)=>{
    try {
        const {seekerid,email}=req.body;
        
        const updatedowner=await seekers.updateOne(
            {seekerid:seekerid,email:email},
            {
                $set:{
                    blocked:true
                }
            }
        )
        if(updatedowner.modifiedCount>0){
            return res.redirect("/admin/blockseeker")
        }
        res.send("Failed to block the seeker")  
    }
    catch (error) {
        console.log(error)
    }
}

module.exports={
    getBlockSeeker,
    postBlockSeeker
}