const { seekercomplaints } = require("../../model/Seeker/seekercomplaintsSchema");
const { SeekerNotification } = require("../../model/Seeker/seekernotificationSchema");

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
        const notification = new SeekerNotification({
            seekerEmail: req.body.email,
            notification: `Response to your complaint with complaint Title: ${req.body.complaint_title} is ${req.body.response}`,
        });

        // Save the notification to the database
        await notification.save();

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