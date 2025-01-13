const { Property } = require("../../model/Owner/PropertySchema")

const getMyProperty=async(req,res)=>{
    try {
        const owneremail=req.cookies.email;
       const myProperties=await Property.find({ownerEmail:owneremail})
    //    console.log(myProperties)
        res.render("ownermyproperties",{myProperties})
    } catch (error) {
        console.log(error)
    }
}
const getViewdetails=async(req,res)=>{
    try {
        // console.log(req.params.id)
        const viewdetailsdata=await Property.findOne({propertyId:req.params.id})
        // console.log(viewdetailsdata)
        res.render("viewdetails",{property:viewdetailsdata})  
    }
    catch (error) {
        console.log(error)
    }
}
module.exports={
    getMyProperty,
    getViewdetails
}