const express = require("express")
const path=require("path")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Home"));
    next();
});

const {getHome}=require("../../controllers/Home/homeController")

router.get("/",getHome)

module.exports = router