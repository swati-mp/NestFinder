const express = require("express")
const path=require("path")

const router = express.Router();

const ownerAuth=require("../../Authentication/ownerAuth")

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Owner"));
    next();
});

const {getOwner,postSearchProperties}=require("../../controllers/Owner/ownerController")

router.get("/",ownerAuth,getOwner)
router.post("/searchproperties",ownerAuth,postSearchProperties)


const {getOwnerProfile,postOwnerProfile,upload1}=require("../../controllers/Owner/ownerprofileController")
router.get("/ownerprofile",getOwnerProfile)
router.post("/ownerprofile",upload1.single('profilepicture'),postOwnerProfile)

const {getAddProperty,postAddProperties,uploadMultiple}=require("../../controllers/Owner/addpropertiesController")
router.get("/owneraddproperties",getAddProperty)
router.post("/owneraddproperties",uploadMultiple,postAddProperties)

const {getMyProperty,getViewdetails}=require("../../controllers/Owner/mypropertiesController")
router.get("/ownermyproperties",getMyProperty)
router.get("/viewdetails/:id",getViewdetails)

const {getOwnerSeekerInquiry}=require("../../controllers/Owner/ownerseekerinquiries")
router.get("/ownerseekerinquiries",getOwnerSeekerInquiry)

const {getOwnerAnalytics}=require("../../controllers/Owner/owneranalyticsController")
router.get("/owneranalytics",getOwnerAnalytics)

const {getOwnerAddComplaints}=require("../../controllers/Owner/owneraddcomplaintsController")
router.get("/owneraddcomplaints",getOwnerAddComplaints)
module.exports = router