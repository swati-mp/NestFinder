const express = require("express")
const path=require("path")

const router = express.Router();

const seekerAuth=require("../../Authentication/seekerAuth")

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Seeker"));
    next();
});

const {getSeeker}=require("../../controllers/Seeker/seekerController")

router.get("/",seekerAuth,getSeeker)

const {getSeekerProfile} = require("../../controllers/Seeker/seekerprofileController")
router.get("/seekerprofile",getSeekerProfile)

const {getInquriesResponse} = require("../../controllers/Seeker/InquriesResponseController")
router.get("/seekerinquiryresponse",getInquriesResponse)

const {getHistory} = require("../../controllers/Seeker/seekerhistoryController")
router.get("/seekerhistory",getHistory)

const {getSeekerWishlist} = require("../../controllers/Seeker/seekerwishlistController")
router.get("/seekerwishlist",getSeekerWishlist)

const {getSeekerComplaint} = require("../../controllers/Seeker/seekercomplaintController")
router.get("/seekercomplaint",getSeekerComplaint)

module.exports = router