const express = require("express")
const path=require("path")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Owner"));
    next();
});

const {getOwner}=require("../../controllers/Owner/ownerController")

router.get("/",getOwner)

module.exports = router