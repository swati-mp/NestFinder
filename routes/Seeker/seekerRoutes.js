const express = require("express")
const path=require("path")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Seeker"));
    next();
});

const {getSeeker}=require("../../controllers/Seeker/seekerController")

router.get("/",getSeeker)

module.exports = router