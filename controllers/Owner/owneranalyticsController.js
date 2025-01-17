const { owners } = require("../../model/Owner/ownerSchema")

const getOwnerAnalytics=async(req,res)=>{
    const ownerprofileimage = await owners.findOne({ email: req.cookies.email }).select("profilepicture")

    res.render("owneranalytics",{
        ownerprofileimage:ownerprofileimage.profilepicture,
        email:req.cookies.email
    })
}
module.exports={
    getOwnerAnalytics
}