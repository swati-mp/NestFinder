const express = require("express")
const path=require("path")

const router = express.Router();

const ownerAuth=require("../../Authentication/ownerAuth")

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Owner"));
    next();
});

const {getOwner,postSearchProperties,postFilterProperties}=require("../../controllers/Owner/ownerController")

router.get("/",ownerAuth,getOwner)
router.post("/searchproperties",ownerAuth,postSearchProperties)
router.post("/filterproperties",ownerAuth,postFilterProperties)


const {getOwnerProfile,postOwnerProfile,upload1}=require("../../controllers/Owner/ownerprofileController")
router.get("/ownerprofile",ownerAuth,getOwnerProfile)
router.post("/ownerprofile",ownerAuth,upload1.single('profilepicture'),postOwnerProfile)

const {getAddProperty,postAddProperties,uploadMultiple}=require("../../controllers/Owner/addpropertiesController")
router.get("/owneraddproperties",ownerAuth,getAddProperty)
router.post("/owneraddproperties",ownerAuth,uploadMultiple,postAddProperties)

const {getMyProperty,getViewdetails,getUpdatedetails,postUpdateProperties,uploadMultiple1,deleteproperty}=require("../../controllers/Owner/mypropertiesController")
router.get("/ownermyproperties",ownerAuth,getMyProperty)
router.get("/viewdetails/:id",ownerAuth,getViewdetails)
router.get("/updatedetails/:id",ownerAuth,getUpdatedetails)
router.post("/ownerupdateproperties",ownerAuth, uploadMultiple1, postUpdateProperties);
router.get("/deleteproperty/:id",ownerAuth,deleteproperty)

const {getOwnerAnalytics}=require("../../controllers/Owner/owneranalyticsController")
router.get("/owneranalytics",ownerAuth,getOwnerAnalytics)

const {getOwnerAddComplaints,postOwnercomplaints}=require("../../controllers/Owner/owneraddcomplaintsController")
router.get("/owneraddcomplaints",ownerAuth,getOwnerAddComplaints)
router.post("/addcomplaints",ownerAuth,postOwnercomplaints)


const {getOwnerNotification,postOwnerNotification} = require("../../controllers/Owner/ownernotificationController")
router.get("/ownernotification",ownerAuth,getOwnerNotification)
router.post("/readownernotification",ownerAuth,postOwnerNotification)

module.exports = router