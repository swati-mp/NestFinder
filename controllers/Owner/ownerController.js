const { owners } = require("../../model/Owner/ownerSchema")
const { Property } = require("../../model/Owner/PropertySchema")

const getOwner = async (req, res) => {
    try {
        const owner = await owners.findOne({ email: req.cookies.email }).select("address.city");

        if (!owner || !owner.address || !owner.address.city) {
            // console.log("City not found for the owner.");
            return res.status(404).send("Owner's city not found.");
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

        res.render("owner", { liveproperties });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error.");
    }
};

module.exports={
    getOwner

}