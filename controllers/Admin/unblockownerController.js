const { owners } = require("../../model/Owner/ownerSchema")

const getUnblockOwner=async(req,res)=>{
    try {
        const unblockowners=await owners.find({blocked:true})
        res.render("unblockowner",{
            adminname:process.env.Admin_Name,
            unblockowners:unblockowners
        })
    } catch (error) {
        console.log(error)
    }
}

const postUnBlockOwner=async(req,res)=>{
    try {
        // console.log(req.body)
        const {ownerid,email}=req.body;
        const updatedowner=await owners.updateOne(
            {ownerid:ownerid,email:email},
            {
                $set:{
                    blocked:false
                }
            }
        )
        if(updatedowner.modifiedCount>0){
            return res.redirect("/admin/unblockowner")
        }
        res.send("Failed to unblock the owner")
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getUnblockOwner,
    postUnBlockOwner
}