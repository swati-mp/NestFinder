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

const {getRegister,postRegister}=require("../../controllers/Auth/registerController");
router.get("/register",getRegister)
router.post("/register",postRegister)

const { getLogout } = require("../../controllers/Auth/logoutController");
router.post("/logout",getLogout)

module.exports = router