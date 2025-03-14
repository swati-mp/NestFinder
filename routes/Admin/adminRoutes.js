const express = require("express")
const path=require("path")

const adminAuth=require("../../Authentication/adminAuth")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Admin"));
    next();
});

const {getAdmin}=require("../../controllers/Admin/adminController")
router.get("/",adminAuth,getAdmin)

const {getOwnerdata}=require("../../controllers/Admin/ownerdataController")
router.get("/ownerdata",adminAuth,getOwnerdata)

const {getSeekerdata}=require("../../controllers/Admin/seekerdataController")
router.get("/seekerdata",adminAuth,getSeekerdata)

const {getAdminProfile}=require("../../controllers/Admin/adminprofileController")
router.get("/adminprofile",adminAuth,getAdminProfile)

const {getProperties,getViewDetails,postSearchProperties,postFilterProperties}=require("../../controllers/Admin/propertiesController")
router.get("/adminproperties",adminAuth,getProperties)
router.get("/viewdetails/:propertyId",adminAuth,getViewDetails)
router.post("/searchproperties",adminAuth ,postSearchProperties)
router.post("/filterproperties",adminAuth,postFilterProperties)

const {getApproveProperties,getViewImages,postApproveProperties,postRejectProperties}=require("../../controllers/Admin/approvepropertiesController")
router.get("/approveproperties",adminAuth,getApproveProperties)
router.get("/viewImages/:propertyId",adminAuth,getViewImages)
router.post("/approveproperties",adminAuth,postApproveProperties)
router.post("/rejectproperties",adminAuth,postRejectProperties)

const {getOwnerComplaint,postOwnerComplaint}=require("../../controllers/Admin/ownercomplaintController")
router.get("/ownercomplaint",adminAuth,getOwnerComplaint)
router.post("/readownercomplaint",adminAuth,postOwnerComplaint)

const {getSeekerComplaint,postSeekerComplaint}=require("../../controllers/Admin/seekercomplaintController")
router.get("/seekercomplaint",adminAuth,getSeekerComplaint)
router.post("/readseekercomplaint",adminAuth,postSeekerComplaint)

const {getBlockOwner,postBlockOwner}=require("../../controllers/Admin/blockownerController")
router.get("/blockowner",adminAuth,getBlockOwner)
router.post("/blockowner",adminAuth,postBlockOwner)

const {getBlockSeeker,postBlockSeeker}=require("../../controllers/Admin/blockseekerController")
router.get("/blockseeker",adminAuth,getBlockSeeker)
router.post("/blockseeker",adminAuth,postBlockSeeker)

const {getUnblockOwner,postUnBlockOwner}=require("../../controllers/Admin/unblockownerController")
router.get("/unblockowner",adminAuth,getUnblockOwner)
router.post("/unblockowner",adminAuth,postUnBlockOwner)

const {getUnblockSeeker,postUnBlockSeeker}=require("../../controllers/Admin/unblockseekerController")
router.get("/unblockseeker",adminAuth,getUnblockSeeker)
router.post("/unblockseeker",adminAuth,postUnBlockSeeker)

module.exports = router