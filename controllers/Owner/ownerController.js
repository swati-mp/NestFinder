const { owners } = require("../../model/Owner/ownerSchema")
const { Property } = require("../../model/Owner/PropertySchema")

const getOwner = async (req, res) => {
    try {
        const owner = await owners.findOne({ email: req.cookies.email }).select("address.city");
        const ownerprofileimage=await owners.findOne({ email: req.cookies.email }).select("profilepicture")
        // console.log(ownerprofileimage)
        if (!owner || !owner.address || !owner.address.city) {
            // console.log("City not found for the owner.");
            // return res.status(404).send("Owner's city not found.");
            const allproperties = await Property.find({ status: "Available", approved: true });
            return res.render("owner", { 
                liveproperties: allproperties,
                notice:"Update your profile to list properties based on your city",
                ownerprofileimage:ownerprofileimage.profilepicture,
                email:req.cookies.email 
            });
        }

        const ownerCity = owner.address.city; // Extract the owner's city
        const query = {};

        // Implement the regular expression for the city
        if (ownerCity.length >= 4) {
            const firstTwo = ownerCity.slice(0, 2); // First two letters
            const lastTwo = ownerCity.slice(-2);   // Last two letters
            query["address.city"] = new RegExp(`^${firstTwo}.*${lastTwo}$`, "i");
        } else {
            query["address.city"] = new RegExp(`^${ownerCity}`, "i");
        }

        // Add other filters to the query
        query.status = "Available";
        query.approved = true;

        const liveproperties = await Property.find(query);

        // console.log("Query:", query);
        // console.log("Live Properties:", liveproperties);

        res.render("owner", { 
            liveproperties,
            ownerprofileimage:ownerprofileimage.profilepicture,
            email:req.cookies.email 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error.");
    }
};

const postSearchProperties = async (req, res) => {
    try {
        // console.log("Request Body:", req.body);
        const { criteria, searchvalue } = req.body;
        let query = { approved: true, status: "Available" };

        if (criteria === "city") {
            // Ensure the search value has enough length
            if (searchvalue.length >= 4) {
                const firstTwo = searchvalue.slice(0, 2);  // First two letters
                const lastTwo = searchvalue.slice(-2);     // Last two letters
                query["address.city"] = new RegExp(`^${firstTwo}.*${lastTwo}$`, 'i'); 
            } else {
                query["address.city"] = new RegExp(`^${searchvalue}`, 'i'); 
            }
        } else if (criteria === "rent") {
            query.rent = { $lte: parseFloat(searchvalue) }; // Ensure rent is compared numerically
        } else if (criteria === "rooms") {
            query.bedrooms = parseInt(searchvalue); // Ensure numeric comparison for rooms
        } 
        const ownerprofileimage=await owners.findOne({ email: req.cookies.email }).select("profilepicture")

        const approvedProperties = await Property.find(query);
        // console.log("approvedProperties:", approvedProperties);
        res.render("owner", {
            adminname: process.env.Admin_Name,
            liveproperties: approvedProperties,
            ownerprofileimage:ownerprofileimage.profilepicture,
            email:req.cookies.email 
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).send("An error occurred while fetching properties.");
    }
};

module.exports={
    getOwner,
    postSearchProperties

}