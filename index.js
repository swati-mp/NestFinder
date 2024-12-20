const express=require("express");
const path=require("path")
const cookieParser = require("cookie-parser")
const fs = require("fs");

const app=express();

//Below package used to access .env data
require("dotenv").config()

//Below code is to fetch port number from .env
const port =process.env.PORT || 4001

//Below Code used to connect to database
require("./database/database")

//Below code is to setup static files for all routes
app.use(express.static(path.join(__dirname,"public")))

//Below code will help to parse form data
app.use(express.urlencoded({extended:true}))

//We are setting view engine to use hbs
app.set("view engine","hbs")

//Using this we can access and parse cookie elements
app.use(cookieParser())

//To parse json data 
app.use(express.json());

//Link to All Routes
const adminRoutes = require("./routes/Admin/adminRoutes")
const authRoutes = require("./routes/Auth/authRoutes")
const homeRoutes = require("./routes/Home/homeRoutes")
const ownerRoutes = require("./routes/Owner/ownerRoutes")
const seekerRoutes = require("./routes/Seeker/seekerRoutes")

//Below code is to setup routes for all modules(Admin,Owner,Seeker) and home(Entrypoint) and auth(login,register)
app.use("/admin",adminRoutes)
app.use("/auth",authRoutes)
app.use("/home",homeRoutes)
app.use("/owner",ownerRoutes)
app.use("/seeker",seekerRoutes)

//if user hit any unregistered route he will get pagenot found error
app.use((req, res) => {
    const defaultViewsDir = path.join(__dirname, "views"); // Main views folder
    const currentViewsDir = req.app.get("views");

    // Check if the current views directory contains pagenotfound.hbs
    if (!fs.existsSync(path.join(currentViewsDir, "pagenotfound.hbs"))) {
        req.app.set("views", defaultViewsDir); // Fallback to default views directory
    }

    res.render("pagenotfound");
});

app.listen(port,()=>{
    console.log(`Server running on port no ${port}`)
})

