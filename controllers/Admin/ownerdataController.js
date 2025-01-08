const { owners } = require("../../model/Owner/ownerSchema")

const getOwnerdata =async(req, res) => {
    try {
        const ownerdata=await owners.find();
        res.render("ownerdata",{
            adminname:process.env.Admin_Name,
            list:ownerdata
        })
    } catch (error) {
        console.log(error)
    }
    
}

module.exports={
    getOwnerdata
}