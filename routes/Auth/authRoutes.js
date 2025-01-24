const express = require("express")
const path=require("path")

const router = express.Router();

router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Auth"));
    next();
});

const {getLogin,postLogin}=require("../../controllers/Auth/loginController")
router.get("/login",getLogin)
router.post("/login",postLogin)

// If you Dont want otp register Feature Then Use Below Code

// const {getRegister,postRegister}=require("../../controllers/Auth/registerController");
// router.get("/register",getRegister)
// router.post("/register",postRegister)

// If you Dont want otp register Feature Then Use Above Code and comment below code 23 to 26

const {getRegister,postRegister,sendOtp}=require("../../controllers/Auth/registerController");
router.get("/register",getRegister)
router.post("/register",postRegister)
router.post("/send-otp",sendOtp)

const { getLogout } = require("../../controllers/Auth/logoutController");
router.post("/logout",getLogout)

module.exports = router