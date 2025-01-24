const { owners } = require("../../model/Owner/ownerSchema")
const { seekers } = require("../../model/Seeker/seekerSchema")
const bcrypt = require("bcryptjs")
const fs = require("fs");
const path = require("path")
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const getRegister = (req, res) => {
    res.render("register")
}

/* If you Dont want otp register Feature Then Use Below Code */
// const postRegister = async (req, res) => {
//     try {
//         // Check if the user already exists
//         const collection = req.body.role === 'owner' ? owners : seekers;
//         const olduserowner = await owners.findOne({ email: req.body.email });
//         const olduserseeker = await seekers.findOne({ email: req.body.email });
        
//         if (olduserowner || olduserseeker) {
//             return res.render("register", {
//                 success: "⚠️ User Already Exists. Please Login.",
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
//         req.body.password = hashedPassword; // Replace plain password with hashed password

//         // Create a new user document and save it to the database
//         const user = new collection(req.body); // Instantiate model with updated req.body
//         const userRegister = await user.save(); // Call save on instance

//         if (userRegister) {
//             const userFolder = path.join(__dirname, "../../public/officialimages", req.body.email);
//             const profileimageFolder=path.join(__dirname, "../../public/profileimages", req.body.email);
//             // Check if the folder already exists
//             if (!fs.existsSync(userFolder)) {
//                 fs.mkdirSync(userFolder, { recursive: true }); // Create folder recursively
//             }
//             if (!fs.existsSync(profileimageFolder)) {
//                 fs.mkdirSync(profileimageFolder, { recursive: true }); // Create folder recursively
//             }
//             return res.render("register", {
//                 success: `🎉 Registration Successful as ${req.body.role === 'owner' ? 'Owner' : 'Seeker'}!`,
//             });
//         }
//     } catch (error) {
//         console.error("Error during registration:", error);
//         return res.render("register", {
//             success: "⚠️ Could not register. Please try again!",
//         });
//     }
// };
// module.exports={
//     getRegister,
//     postRegister
// }
/* If you Dont want otp register Feature Then Use Above Code and comment below code 62 to 190*/ 

let otpStore = {}; // Temporary in-memory store for OTPs

// Step 1: Handle OTP generation and sending
const sendOtp = async (req, res) => {
    try {
        const { email, role,name } = req.body;

        if (!email || !role) {
            return res.render("register", {
                success: "⚠️ Email and Role are required.",
            });
        }

        // Check if user already exists
        const existingOwner = await owners.findOne({ email });
        const existingSeeker = await seekers.findOne({ email });
        if (existingOwner || existingSeeker) {
            return res.render("register", {
                success: "⚠️ User already exists. Please login.",
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
        });

        // Save OTP in temporary store with a timestamp
        otpStore[email] = { otp, timestamp: Date.now() };

        // Send OTP via email
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.forgotuser,
                pass: process.env.forgotpass,
            },
        });

        await transporter.sendMail({
            from: '"NestFinder 👻" <nestfinder@gmail.com>',
            to: email,
            subject: "Your OTP Verification Code",
            html: `<h2>Your OTP is: ${otp}</h2><p>It is valid for 5 minutes.</p>`,
        });

        return res.render("register", {
            success: "✅ OTP sent successfully to your email.",
            email:email,
            role:role,
            name:name
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.render("register", {
            success: "⚠️ Could not send OTP. Please try again.",
        });
    }
};

// Step 2: Verify OTP and register user
const postRegister = async (req, res) => {
    try {
        const { email, password, role, otp,name } = req.body;

        if (!otpStore[email] || otpStore[email].otp !== otp) {
            return res.render("register", {
                success: "⚠️ Invalid or expired OTP.",
            });
        }

        // Check if OTP is expired (5 minutes = 300000 ms)
        if (Date.now() - otpStore[email].timestamp > 300000) {
            delete otpStore[email];
            return res.render("register", {
                success: "⚠️ OTP expired. Please request a new one.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine the collection (Owner/Seeker)
        const collection = role === "owner" ? owners : seekers;

        // Save user to the database
        const newUser = new collection({ email, password: hashedPassword, role,name });
        const userRegister = await newUser.save();

        // Create folders for the user
        const userFolder = path.join(
            __dirname,
            "../../public/officialimages",
            email
        );
        const profileImageFolder = path.join(
            __dirname,
            "../../public/profileimages",
            email
        );

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }
        if (!fs.existsSync(profileImageFolder)) {
            fs.mkdirSync(profileImageFolder, { recursive: true });
        }

        // Clean up OTP store after successful registration
        delete otpStore[email];

        return res.render("register", {
            success: `🎉 Registration successful as ${role === "owner" ? "Owner" : "Seeker"}!`,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.render("register", {
            success: "⚠️ Could not complete registration. Please try again!",
        });
    }
};


module.exports = {
    getRegister,
    postRegister,
    sendOtp
}