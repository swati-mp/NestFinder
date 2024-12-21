const express = require("express")
const path=require("path")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Admin"));
    next();
});

const {getAdmin}=require("../../controllers/Admin/adminController")
router.get("/",getAdmin)

const {getOwnerdata}=require("../../controllers/Admin/ownerdataController")
router.get("/ownerdata",getOwnerdata)

const {getSeekerdata}=require("../../controllers/Admin/seekerdataController")
router.get("/seekerdata",getSeekerdata)

const {getAdminProfile}=require("../../controllers/Admin/adminprofileController")
router.get("/adminprofile",getAdminProfile)

const {getProperties}=require("../../controllers/Admin/propertiesController")
router.get("/adminproperties",getProperties)

const {getApproveProperties}=require("../../controllers/Admin/approvepropertiesController")
router.get("/approveproperties",getApproveProperties)

const {getOwnerComplaint}=require("../../controllers/Admin/ownercomplaintController")
router.get("/ownercomplaint",getOwnerComplaint)

const {getSeekerComplaint}=require("../../controllers/Admin/seekercomplaintController")
router.get("/seekercomplaint",getSeekerComplaint)

const {getBlockOwner}=require("../../controllers/Admin/blockownerController")
router.get("/blockowner",getBlockOwner)

const {getBlockSeeker}=require("../../controllers/Admin/blockseekerController")
router.get("/blockseeker",getBlockSeeker)

const {getUnblockOwner}=require("../../controllers/Admin/unblockownerController")
router.get("/unblockowner",getUnblockOwner)

const {getUnblockSeeker}=require("../../controllers/Admin/unblockseekerController")
router.get("/unblockseeker",getUnblockSeeker)

module.exports = router