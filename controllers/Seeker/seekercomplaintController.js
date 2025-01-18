const { seekercomplaints } = require("../../model/Seeker/seekercomplaintsSchema")
const { seekers } = require("../../model/Seeker/seekerSchema")

const getSeekerComplaint= async(req, res) => {
    try {
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        res.render("seekercomplaint",{
            email:req.cookies.email,
            seekerprofileimage:seekerprofileimage.profilepicture
        })  
    } catch (error) {
        console.log(error)  
        
    }
}

const postSeekercomplaints = async (req, res) => {
    try {
        const email = req.cookies.email; // Get email from cookies
        const seekerData = await seekers.findOne({ email }).select("seekerid"); // Fetch owner ID using email
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")

        if (!seekerData) {
            return res.status(404).send("Seeker not found");
        }

        const seekerid = seekerData.seekerid;
        const { complaintTitle, complaintDetails } = req.body; // Get form data

        // Create a new complaint document
        const newComplaint = new seekercomplaints({
            seekerid,
            email,
            complaint_title: complaintTitle,
            complaint_details: complaintDetails,
        });

        // Save to the database
        await newComplaint.save();

        res.render("seekercomplaint", { 
            success: "Complaint submitted successfully",
            seekerprofileimage:seekerprofileimage.profilepicture,
            email:req.cookies.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while submitting the complaint");
    }
};

module.exports={
    getSeekerComplaint,
    postSeekercomplaints
}