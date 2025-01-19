const { OwnerNotification } = require("../../model/Owner/ownernotificationSchema")
const { owners } = require("../../model/Owner/ownerSchema")
const { Property } = require("../../model/Owner/PropertySchema")

const getOwnerAnalytics=async(req,res)=>{
    const ownerprofileimage = await owners.findOne({ email: req.cookies.email }).select("profilepicture")

    const onwernotificationcount = await OwnerNotification.find({ ownerEmail: req.cookies.email }).countDocuments()
    const totalproperties = await Property.find({ ownerEmail: req.cookies.email }).countDocuments()
    const livepropertiescount = await Property.find({ ownerEmail: req.cookies.email, status: "Available",approved:true }).countDocuments()
    const pendingpropertiescount = await Property.find({ ownerEmail: req.cookies.email,approved:false }).countDocuments()

    res.render("owneranalytics",{
        ownerprofileimage:ownerprofileimage.profilepicture,
        email:req.cookies.email,
        onwernotificationcount,
        totalproperties,
        livepropertiescount,
        pendingpropertiescount
    })
}
module.exports={
    getOwnerAnalytics
}