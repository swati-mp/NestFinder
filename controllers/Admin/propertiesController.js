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

module.exports={
    getProperties,
    getViewDetails
}