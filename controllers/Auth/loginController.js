const { owners } = require("../../model/Owner/ownerSchema");
const { seekers } = require("../../model/Seeker/seekerSchema");
const path = require("path")
const bcrypt = require("bcryptjs")
const express=require("express")
const router=express.Router();

// Below code is to render login page when user hits /auth/login
const getLogin = (req, res) => {
    res.render("login")
}

// Below is Login Api
const postLogin = async (req, res) => {
    try {
        // Set Cookie Function
        function setCookie(email){
            res.cookie("email", email, {
                maxAge: 2 * 60 * 60 * 1000
            });  
        }
        // Get the Values from Login Page
        const { email, password } = req.body;
        
        // Verify if the user is admin and render him to admin page
        if (email == process.env.Admin_Email && password == process.env.Admin_password) {
            req.app.set("views", path.join(__dirname, "../../views/Admin"));
            setCookie(email)
            return res.render("admin")
        }

        // find the email in owners and seekers collection
        const owner = await owners.findOne({ email: email })
        const seeker = await seekers.findOne({ email: email })

        // If the email is present in owner collection
        // and the password matches then below if condition will execute
        if (owner && await bcrypt.compare(password, owner.password)) {
            req.app.set("views", path.join(__dirname, "../../views/Owner"));
            setCookie(email)
            return res.render("owner")
        }  
        
        // If the email is present in seeker collection
        // and the password matches then below if condition will execute
        if (seeker && await bcrypt.compare(password, seeker.password)) {
            req.app.set("views", path.join(__dirname, "../../views/Seeker"));
            setCookie(email)
            return res.render("seeker")
        } 
    
        // if email is not present in any collection then below will be executed
        return res.render("login", {
            success: "Invalid User"
        });

    } catch (error) {
        console.log(error)
        res.render("login", {
            success: "Could not Login retry"
        })
    }
}

// In Above postLogin Api i have changed views default directory
// to avoid problems we resetting it back to Auth folder in views
router.use((req, res, next) => {
    req.app.set("views", path.join(__dirname, "../../views/Auth"));
    next();
});

module.exports = {
    getLogin,
    postLogin
}