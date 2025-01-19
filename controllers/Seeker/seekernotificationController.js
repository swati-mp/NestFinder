const { SeekerNotification } = require("../../model/Seeker/seekernotificationSchema");
const { seekers } = require("../../model/Seeker/seekerSchema");

const getSeekerNotification = async(req, res) => {
    try {
        const seekerprofileimage=await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        const seekernotificationdata = await SeekerNotification.find({ seekerEmail: req.cookies.email }).sort({ date: -1 });
        //console.log(seekernotificationdata);
        res.render('seekernotification',{
            seekerprofileimage:seekerprofileimage.profilepicture,
            email:req.cookies.email,
            list:seekernotificationdata
        }); 
    } catch (error) {
        console.log(error);
    }
   
};

const postSeekerNotification=async(req,res)=>{
    try {
        await SeekerNotification.deleteOne({_id:req.body.id});
        //const seekernotificationdata = await SeekerNotification.find({ seekerEmail: req.cookies.email }).sort({ date: -1 });
        //const seekerprofileimage=await seekers.findOne({ email: req.cookies.email }).select("profilepicture")


        // res.render("seekernotification",{
        //     adminname:process.env.Admin_Name,
        //     list:seekernotificationdata
        // })
        res.redirect("/seeker/seekernotification");
    } catch (error) {
        console.log(error)
    }
}

// Export the controller function
module.exports = {
    getSeekerNotification,
    postSeekerNotification
};