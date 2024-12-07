const express = require("express")
const path=require("path")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Auth"));
    next();
});

const {getLogin}=require("../../controllers/Auth/authController")

router.get("/login",getLogin)

module.exports = router