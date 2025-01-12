const {Property}=require("../../model/Owner/PropertySchema")

const getProperties=async(req,res)=>{
    try {
        const approvedproperties=await Property.find({approved:true,status:"Available"})

        res.render("adminproperties",{
            adminname:process.env.Admin_Name,
            approvedproperties:approvedproperties
        })
    } catch (error) {
        console.log(error)
    }
}

const getViewDetails=async(req,res)=>{
    try {
        const propertyId=req.params.propertyId
        const property=await Property.findOne({propertyId:propertyId})
        if(!property){
            return res.status(404).json({message:"Property not found"})
        }
        res.render("viewdetails",{
            adminname:process.env.Admin_Name,
            property:property
        })
    }
    catch(error){
        console.log(error)
    }
}

const postSearchProperties = async (req, res) => {
    try {
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
        } else if (criteria === "owneremail") {
            query.ownerEmail = searchvalue.trim();
        }

        const approvedProperties = await Property.find(query);
        res.render("adminproperties", {
            adminname: process.env.Admin_Name,
            approvedproperties: approvedProperties
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).send("An error occurred while fetching properties.");
    }
};


module.exports={
    getProperties,
    getViewDetails,
    postSearchProperties
}