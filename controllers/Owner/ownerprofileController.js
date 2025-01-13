const { owners } = require("../../model/Owner/ownerSchema");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const getOwnerProfile = async (req, res) => {
    try {
        const email = req.cookies.email;
        const ownerdata = await owners.findOne({ email: email });
        res.render("ownerprofile", {
            ownerdata
        })
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

const postOwnerProfile = async (req, res) => {
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
            const ownerdata = await owners.findOne({ email });

            // Delete the existing profile picture if it exists
            if (ownerdata.profilepicture) {
                const oldImagePath = path.join(__dirname, '../../public/profileimages', email, ownerdata.profilepicture);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image
                }
            }

            // Add the new profile picture to the update data
            updateData.profilepicture = req.file.filename;
        }

        // Perform the update operation directly
        const updatedOwner = await owners.findOneAndUpdate(
            { email },            // Search condition
            { $set: updateData }, // Update fields
            { new: true }         // Return the updated document
        );

        if (!updatedOwner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        const ownerdata = await owners.findOne({ email: email });
        res.render("ownerprofile", {
            ownerdata,
            success: 'Profile updated successfully'
        })
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {
    getOwnerProfile,
    postOwnerProfile,
    upload1
}