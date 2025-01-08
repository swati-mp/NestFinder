const { seekers } = require("../../model/Seeker/seekerSchema")

const getSeekerdata =async(req, res) => {
    try {
        const seekerdata=await seekers.find();
        res.render("seekerdata",{
            adminname:process.env.Admin_Name,
            list:seekerdata
        })
    } catch (error) {
        console.log(error)
    } 
}

module.exports={
    getSeekerdata
}