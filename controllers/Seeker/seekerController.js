const { seekers } = require("../../model/Seeker/seekerSchema")

const getSeeker= async(req, res) => {
    
    try {
        
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        res.render("seeker", {
            seekerprofileimage: seekerprofileimage.profilepicture,
            email: req.cookies.email
        });
    } catch (error) {
        console.log(error)
        
    }
}

module.exports={
    getSeeker
}