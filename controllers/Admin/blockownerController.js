const { owners } = require("../../model/Owner/ownerSchema")

const getBlockOwner=async(req,res)=>{
    const ownerslist=await owners.find({blocked:false})

    res.render("blockowner",{
        adminname:process.env.Admin_Name,
        ownerslist:ownerslist
    })
}

const postBlockOwner=async(req,res)=>{
    try {
        // console.log(req.body)
        const {ownerid,email}=req.body;
        const updatedowner=await owners.updateOne(
            {ownerid:ownerid,email:email},
            {
                $set:{
                    blocked:true
                }
            }
        )
        if(updatedowner.modifiedCount>0){
            return res.redirect("/admin/blockowner")
        }
        res.send("Failed to block the owner")
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getBlockOwner,
    postBlockOwner
}