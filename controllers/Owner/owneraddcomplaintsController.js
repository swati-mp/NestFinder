const { ownercomplaints } = require("../../model/Owner/ownercomplaintsSchema");
const { owners } = require("../../model/Owner/ownerSchema")

const getOwnerAddComplaints=(req,res)=>{
    res.render("owneraddcomplaints")

}

const postOwnercomplaints = async (req, res) => {
    try {
        const email = req.cookies.email; // Get email from cookies
        const ownerData = await owners.findOne({ email }).select("ownerid"); // Fetch owner ID using email

        if (!ownerData) {
            return res.status(404).send("Owner not found");
        }

        const ownerid = ownerData.ownerid;
        const { complaintTitle, complaintDetails } = req.body; // Get form data

        // Create a new complaint document
        const newComplaint = new ownercomplaints({
            ownerid,
            email,
            complaint_title: complaintTitle,
            complaint_details: complaintDetails,
        });

        // Save to the database
        await newComplaint.save();

        res.render("owneraddcomplaints", { success: "Complaint submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while submitting the complaint");
    }
};


module.exports={
    getOwnerAddComplaints,
    postOwnercomplaints
}