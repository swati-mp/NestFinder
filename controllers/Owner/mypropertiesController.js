const { owners } = require("../../model/Owner/ownerSchema");
const { Property } = require("../../model/Owner/PropertySchema")

const getMyProperty = async (req, res) => {
    try {
        const owneremail = req.cookies.email;
        const myProperties = await Property.find({ ownerEmail: owneremail })
        const ownerprofileimage = await owners.findOne({ email: req.cookies.email }).select("profilepicture")

        //    console.log(myProperties)
        res.render("ownermyproperties", {
            myProperties,
            email: owneremail,
            ownerprofileimage: ownerprofileimage.profilepicture
        })
    } catch (error) {
        console.log(error)
    }
}
const getViewdetails = async (req, res) => {
    try {
        // console.log(req.params.id)
        const viewdetailsdata = await Property.findOne({ propertyId: req.params.id })
        const ownerprofileimage = await owners.findOne({ email: req.cookies.email }).select("profilepicture")

        // console.log(viewdetailsdata)
        res.render("viewdetails", { 
            property: viewdetailsdata,
            email: req.cookies.email,
            ownerprofileimage: ownerprofileimage.profilepicture
        })
    }
    catch (error) {
        console.log(error)
    }
}
module.exports = {
    getMyProperty,
    getViewdetails
}