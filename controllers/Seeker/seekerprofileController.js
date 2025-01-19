const { seekers } = require("../../model/Seeker/seekerSchema");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const getSeekerProfile = async (req, res) => {
    try {
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")

        const email = req.cookies.email;
        const seekerdata = await seekers.findOne({ email: email });
        res.render("seekerprofile", {
            seekerdata,
            seekerprofileimage: seekerprofileimage.profilepicture,
            email: req.cookies.email
        });

    } catch (error) {
        console.log(error)

    }

}


const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        const email = req.cookies.email;
        const folderPath = path.join(__dirname, '../../public/profileimages', email);

        // Ensure directory exists before storing the file
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload1 = multer({ storage: storage1 });

const postSeekerProfile = async (req, res) => {
    const email = req.cookies.email; // Email from cookie
    const { name, lastname, phonenumber, street, city, state, zipcode } = req.body;

    try {
        // Prepare the update object dynamically
        const updateData = {
            name,
            lastname,
            phonenumber,
            address: { street, city, state, zipcode }
        };

        if (req.file) {
            const seekerdata = await seekers.findOne({ email });

            // Delete the existing profile picture if it exists
            if (seekerdata.profilepicture) {
                const oldImagePath = path.join(__dirname, '../../public/profileimages', email, seekerdata.profilepicture);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image
                }
            }

            // Add the new profile picture to the update data
            updateData.profilepicture = req.file.filename;
        }

        // Perform the update operation directly
        const updatedSeeker = await seekers.findOneAndUpdate(
            { email },            // Search condition
            { $set: updateData }, // Update fields
            { new: true }         // Return the updated document
        );

        if (!updatedSeeker) {
            return res.status(404).json({ message: 'Seeker not found' });
        }

        const seekerdata = await seekers.findOne({ email: email });
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")

        res.render("seekerprofile", {
            seekerdata,
            success: 'Profile updated successfully',
            seekerprofileimage: seekerprofileimage.profilepicture,
            email: req.cookies.email
        })
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getSeekerProfile,
    postSeekerProfile,
    upload1
}