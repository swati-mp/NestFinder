const { seekers } = require("../../model/Seeker/seekerSchema")

const getSeekerWishlist = async(req,res)=>{
    try {
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        res.render("seekerwishlist",{
            email:req.cookies.email,
            seekerprofileimage:seekerprofileimage.profilepicture
        })
    } catch (error) {
        console.log(error)
        
    }
    

}

module.exports = {
    getSeekerWishlist
}