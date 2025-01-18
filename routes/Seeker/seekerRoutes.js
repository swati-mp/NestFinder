const express = require("express")
const path=require("path")

const router = express.Router();

const seekerAuth=require("../../Authentication/seekerAuth")

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Seeker"));
    next();
});

const {getSeeker,getViewdetails}=require("../../controllers/Seeker/seekerController")

router.get("/",seekerAuth,getSeeker)
router.get("/viewdetails/:id",seekerAuth,getViewdetails)

const {getSeekerProfile,postSeekerProfile,upload1} = require("../../controllers/Seeker/seekerprofileController")
router.get("/seekerprofile",getSeekerProfile)
router.post("/seekerprofile",upload1.single('profilepicture'),postSeekerProfile)

const {getSeekerWishlist} = require("../../controllers/Seeker/seekerwishlistController")
router.get("/seekerwishlist",getSeekerWishlist)

const {getSeekerComplaint,postSeekercomplaints} = require("../../controllers/Seeker/seekercomplaintController")
router.get("/seekercomplaint",getSeekerComplaint)
router.post("/addcomplaints",postSeekercomplaints)    

module.exports = router