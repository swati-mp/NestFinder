const express = require("express")
const path=require("path")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Auth"));
    next();
});

const {getLogin}=require("../../controllers/Auth/loginController")
router.get("/login",getLogin)

const {getRegister}=require("../../controllers/Auth/registerController")
router.get("/register",getRegister)

module.exports = router