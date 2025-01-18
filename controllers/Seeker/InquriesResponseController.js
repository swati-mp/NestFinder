const { seekers } = require("../../model/Seeker/seekerSchema")

const getInquriesResponse = async (req,res) => {
    try {
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        res.render("seekerinquiryresponse",{
            email:req.cookies.email,
            seekerprofileimage:seekerprofileimage.profilepicture
        })
    } catch (error) {
        console.log(error)
        
    }
    
}

module.exports = {
    getInquriesResponse
}