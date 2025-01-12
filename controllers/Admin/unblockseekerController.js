const { seekers } = require("../../model/Seeker/seekerSchema")

const getUnblockSeeker=async(req,res)=>{
    try {
        const unblockseekers=await seekers.find({blocked:true})
        res.render("unblockseeker",{
            adminname:process.env.Admin_Name,
            unblockseekers:unblockseekers
        })
    } catch (error) {
        console.log(error)
    }
    
}

const postUnBlockSeeker=async (req,res)=>{
    try {
        const {seekerid,email}=req.body;
        
        const updatedseeker=await seekers.updateOne(
            {seekerid:seekerid,email:email},
            {
                $set:{
                    blocked:false
                }
            }
        )
        if(updatedseeker.modifiedCount>0){
            return res.redirect("/admin/unblockseeker")
        }
        res.send("Failed to unblock the seeker")  
    }
    catch (error) {
        console.log(error)
    }
}

module.exports={
    getUnblockSeeker,
    postUnBlockSeeker
}