const express = require("express")
const path=require("path")

const router = express.Router();

const seekerAuth=require("../../Authentication/seekerAuth")

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Seeker"));
    next();
});

const {getSeeker,getViewdetails,postSearchProperties}=require("../../controllers/Seeker/seekerController")

router.get("/",seekerAuth,getSeeker)
router.get("/viewdetails/:id",seekerAuth,getViewdetails)
router.post("/searchproperties",seekerAuth,postSearchProperties)

const {getSeekerProfile,postSeekerProfile,upload1} = require("../../controllers/Seeker/seekerprofileController")
router.get("/seekerprofile",seekerAuth,getSeekerProfile)
router.post("/seekerprofile",seekerAuth,upload1.single('profilepicture'),postSeekerProfile)

const {getSeekerWishlist} = require("../../controllers/Seeker/seekerwishlistController")
router.get("/seekerwishlist",seekerAuth,getSeekerWishlist)

const {getSeekerComplaint,postSeekercomplaints} = require("../../controllers/Seeker/seekercomplaintController")
router.get("/seekercomplaint",seekerAuth,getSeekerComplaint)
router.post("/addcomplaints",seekerAuth,postSeekercomplaints)    

const {getSeekerNotification,postSeekerNotification} = require("../../controllers/Seeker/seekernotificationController")
router.get("/seekernotification",seekerAuth,getSeekerNotification)
router.post("/readseekernotification",seekerAuth,postSeekerNotification)

module.exports = router