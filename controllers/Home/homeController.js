const {Property}=require("../../model/Owner/PropertySchema")

const getHome= async(req, res) => {
    try {
        const approvedproperties=await Property.find({approved:true,status:"Available"})

        res.render("home",{
            approvedproperties:approvedproperties
        })
    } catch (error) {
        console.log(error)
    }
}

const getAboutUs=(req,res)=>{
    res.render("aboutus")
}

const getViewDetails=(req,res)=>{
    res.render("viewdetails")
}

module.exports={
    getHome,
    getAboutUs,
    getViewDetails
}