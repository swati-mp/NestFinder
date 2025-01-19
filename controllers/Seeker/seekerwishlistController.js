const { Property } = require("../../model/Owner/PropertySchema");
const { seekers } = require("../../model/Seeker/seekerSchema")

const getSeekerWishlist = async(req,res)=>{
    try {
        const seekerdata = await seekers.findOne({ email: req.cookies.email })
        
        // Fetch all properties that match the propertyIds in the wishlist
        const properties = await Property.find({
            status: "Available",
            approved: true,
            propertyId: { $in: seekerdata.wishlist }
        });

        res.render("seekerwishlist",{
            email:req.cookies.email,
            seekerprofileimage:seekerdata.profilepicture,
            liveproperties: properties
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getSeekerWishlist
}