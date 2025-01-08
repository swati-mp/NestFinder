const { ownercomplaints } = require("../../model/Owner/ownercomplaintsSchema")

const getOwnerComplaint=async(req,res)=>{
    try {
        const ownercomplaintdata=await ownercomplaints.find();
        res.render("ownercomplaint",{
            adminname:process.env.Admin_Name,
            list:ownercomplaintdata
        })
    } catch (error) {
        console.log(error)
    }
}

const postOwnerComplaint=async(req,res)=>{
    try {
        await ownercomplaints.deleteOne({complaintid:req.body.complaintid});
        const ownercomplaintdata=await ownercomplaints.find();

        res.render("ownercomplaint",{
            adminname:process.env.Admin_Name,
            list:ownercomplaintdata
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getOwnerComplaint,
    postOwnerComplaint
}