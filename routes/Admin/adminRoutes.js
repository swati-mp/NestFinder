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

module.exports = router