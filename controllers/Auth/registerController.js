const {owners}=require("../../model/Owner/ownerSchema")
const {seekers}=require("../../model/Seeker/seekerSchema")
const bcrypt=require("bcryptjs")
const fs = require("fs");
const path=require("path")

const getRegister= (req, res) => {
    res.render("register")
}

const postRegister = async (req, res) => {
    try {
        // Check if the user already exists
        const collection = req.body.role === 'owner' ? owners : seekers;
        const olduserowner = await owners.findOne({ email: req.body.email });
        const olduserseeker = await seekers.findOne({ email: req.body.email });
        
        if (olduserowner || olduserseeker) {
            return res.render("register", {
                success: "⚠️ User Already Exists. Please Login.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
        req.body.password = hashedPassword; // Replace plain password with hashed password

        // Create a new user document and save it to the database
        const user = new collection(req.body); // Instantiate model with updated req.body
        const userRegister = await user.save(); // Call save on instance

        if (userRegister) {
            const userFolder = path.join(__dirname, "../../public/officialimages", req.body.email);
            
            // Check if the folder already exists
            if (!fs.existsSync(userFolder)) {
                fs.mkdirSync(userFolder, { recursive: true }); // Create folder recursively
            }
            return res.render("register", {
                success: `🎉 Registration Successful as ${req.body.role === 'owner' ? 'Owner' : 'Seeker'}!`,
            });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.render("register", {
            success: "⚠️ Could not register. Please try again!",
        });
    }
};


module.exports={
    getRegister,
    postRegister
}