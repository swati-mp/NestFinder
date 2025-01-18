const { Property } = require("../../model/Owner/PropertySchema");
const { seekers } = require("../../model/Seeker/seekerSchema")

const getSeeker = async (req, res) => {
    try {
        const seeker = await seekers.findOne({ email: req.cookies.email }).select("address.city");
        const seekerprofileimage=await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        // console.log(ownerprofileimage)
        if (!seeker || !seeker.address || !seeker.address.city) {
            // console.log("City not found for the seeker.");
            // return res.status(404).send("Owner's city not found.");
            const allproperties = await Property.find({ status: "Available", approved: true });
            return res.render("seeker", { 
                liveproperties: allproperties,
                notice:"Update your profile to list properties based on your city",
                seekerprofileimage:seekerprofileimage.profilepicture,
                email:req.cookies.email 
            });
        }

        const seekerCity = seeker.address.city; // Extract the owner's city
        const query = {};

        // Implement the regular expression for the city
        if (seekerCity.length >= 4) {
            const firstTwo = seekerCity.slice(0, 2); // First two letters
            const lastTwo = seekerCity.slice(-2);   // Last two letters
            query["address.city"] = new RegExp(`^${firstTwo}.*${lastTwo}$`, "i");
        } else {
            query["address.city"] = new RegExp(`^${seekerCity}`, "i");
        }

        // Add other filters to the query
        query.status = "Available";
        query.approved = true;

        const liveproperties = await Property.find(query);

        // console.log("Query:", query);
        // console.log("Live Properties:", liveproperties);

        res.render("seeker", { 
            liveproperties,
            seekerprofileimage:seekerprofileimage.profilepicture,
            email:req.cookies.email 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error.");
    }
};

const getViewdetails = async (req, res) => {
    try {
        // console.log(req.params.id)
        const viewdetailsdata = await Property.findOne({ propertyId: req.params.id })
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")

        // console.log(viewdetailsdata)
        res.render("viewdetails", { 
            property: viewdetailsdata,
            email: req.cookies.email,
            seekerprofileimage: seekerprofileimage.profilepicture
        })
    }
    catch (error) {
        console.log(error)
    }
}

module.exports={
    getSeeker,
    getViewdetails
}