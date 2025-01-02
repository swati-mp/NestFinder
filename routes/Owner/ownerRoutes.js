const express = require("express")
const path=require("path")

const router = express.Router();

const ownerAuth=require("../../Authentication/ownerAuth")

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Owner"));
    next();
});

const {getOwner}=require("../../controllers/Owner/ownerController")

router.get("/",ownerAuth,getOwner)

const {getOwnerProfile}=require("../../controllers/Owner/ownerprofileController")
router.get("/ownerprofile",getOwnerProfile)

const {getAddProperty}=require("../../controllers/Owner/addpropertiesController")
router.get("/owneraddproperties",getAddProperty)

const {getMyProperty}=require("../../controllers/Owner/mypropertiesController")
router.get("/ownermyproperties",getMyProperty)
module.exports = router