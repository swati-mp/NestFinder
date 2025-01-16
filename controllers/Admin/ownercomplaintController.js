const { ownercomplaints } = require("../../model/Owner/ownercomplaintsSchema");
const { OwnerNotification } = require("../../model/Owner/ownernotificationSchema");

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
        // console.log(req.body)
        // Create a notification for the owner
        const notification = new OwnerNotification({
            ownerEmail: req.body.email,
            notification: `Response to your complaint with complaint Title: ${req.body.complaint_title} is ${req.body.response}`,
        });

        // Save the notification to the database
        await notification.save();

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