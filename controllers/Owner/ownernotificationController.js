const { OwnerNotification } = require("../../model/Owner/ownernotificationSchema");
const { owners } = require("../../model/Owner/ownerSchema");

const getOwnerNotification = async(req, res) => {
    try {
        const ownerprofileimage=await owners.findOne({ email: req.cookies.email }).select("profilepicture")
        const ownernotificationdata = await OwnerNotification.find({ ownerEmail: req.cookies.email }).sort({ date: -1 });
        //console.log(seekernotificationdata);
        res.render('ownernotification',{
            ownerprofileimage:ownerprofileimage.profilepicture,
            email:req.cookies.email,
            list:ownernotificationdata
        }); 
    } catch (error) {
        console.log(error);
    }
};

const postOwnerNotification=async(req,res)=>{
    try {
        await OwnerNotification.deleteOne({_id:req.body.id});
        res.redirect("/owner/ownernotification");
    } catch (error) {
        console.log(error)
    }
}

// Export the controller function
module.exports = {
    getOwnerNotification,
    postOwnerNotification
};