const { seekercomplaints } = require("../../model/Seeker/seekercomplaintsSchema");

const getSeekerComplaint=async(req,res)=>{
    try {
        const seekercomplaintdata=await seekercomplaints.find();
        res.render("seekercomplaint",{
            adminname:process.env.Admin_Name,
            list:seekercomplaintdata
        })
    } catch (error) {
        console.log(error)
    }
}

const postSeekerComplaint=async(req,res)=>{
    try {
        await seekercomplaints.deleteOne({complaintid:req.body.complaintid});
        const seekercomplaintdata=await seekercomplaints.find();

        res.render("seekercomplaint",{
            adminname:process.env.Admin_Name,
            list:seekercomplaintdata
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getSeekerComplaint,
    postSeekerComplaint
}