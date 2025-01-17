const { owners } = require("../../model/Owner/ownerSchema");
const { Property } = require("../../model/Owner/PropertySchema")
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const getMyProperty = async (req, res) => {
    try {
        const owneremail = req.cookies.email;
        const myProperties = await Property.find({ ownerEmail: owneremail })
        const ownerprofileimage = await owners.findOne({ email: req.cookies.email }).select("profilepicture")

        //    console.log(myProperties)
        res.render("ownermyproperties", {
            myProperties,
            email: owneremail,
            ownerprofileimage: ownerprofileimage.profilepicture
        })
    } catch (error) {
        console.log(error)
    }
}
const getViewdetails = async (req, res) => {
    try {
        // console.log(req.params.id)
        const viewdetailsdata = await Property.findOne({ propertyId: req.params.id })
        const ownerprofileimage = await owners.findOne({ email: req.cookies.email }).select("profilepicture")

        // console.log(viewdetailsdata)
        res.render("viewdetails", { 
            property: viewdetailsdata,
            email: req.cookies.email,
            ownerprofileimage: ownerprofileimage.profilepicture
        })
    }
    catch (error) {
        console.log(error)
    }
}

const getUpdatedetails = async (req, res) => {
    try {
        // console.log(req.params.id)
        const viewdetailsdata = await Property.findOne({ propertyId: req.params.id })
        const ownerprofileimage = await owners.findOne({ email: req.cookies.email }).select("profilepicture")

        // console.log(viewdetailsdata)
        res.render("updatedetails", { 
            property: viewdetailsdata,
            email: req.cookies.email,
            ownerprofileimage: ownerprofileimage.profilepicture
        })
    }
    catch (error) {
        console.log(error)
    }
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userEmail = req.body.ownerEmail;
        const dir = path.join(__dirname, "../../public/officialimages", userEmail);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });
const uploadMultiple1 = upload.fields([
    { name: "images", maxCount: 10 },
    { name: "govtid", maxCount: 1 },
    { name: "propertydoc", maxCount: 1 },
]);

// Function to delete a file if it exists
const deleteFile = (filePath) => {
    try {
        const absolutePath = path.join(__dirname,"../../public", filePath);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath); 
            // console.log(`Deleted: ${absolutePath}`);
        }
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};

const postUpdateProperties = async (req, res) => {
    try {
        const { body, files } = req;
        const propertyId = body.propertyId;

        // Fetch the existing property and owner profile picture
        const property = await Property.findOne({ propertyId: propertyId });
        if (!property) {
            return res.status(404).send("Property not found");
        }

        const ownerProfileImage = await owners.findOne({ email: req.cookies.email }).select("profilepicture");

        // Validate map location
        if (!body.latitude || !body.longitude) {
            return res.render("ownerupdateproperties", {
                email: req.cookies.email,
                success: "Please select the location on the map.",
                ownerprofileimage: ownerProfileImage.profilepicture,
            });
        }

        // Prepare fields for update
        const updateFields = {
            title: body.title,
            description: body.description,
            rent: body.rent,
            deposit: body.deposit,
            "address.street": body.street,
            "address.city": body.city,
            "address.state": body.state,
            "address.zipcode": body.zipcode,
            ownerPhone: body.ownerPhone,
            ownerEmail: body.ownerEmail,
            bedrooms: body.bedrooms,
            bathrooms: body.bathrooms,
            "mapLocation.latitude": body.latitude,
            "mapLocation.longitude": body.longitude,
            datePosted: body.datePosted,
            status: body.status,
            approved: false, // Mark property unapproved after update
        };

        // Collect old file paths to delete later
        let oldFilesToDelete = [];

        // Conditionally update images and collect old images for deletion
        if (files.images) {
            oldFilesToDelete.push(...property.images); // Collect old images
            updateFields.images = files.images.map(file => `/officialimages/${body.ownerEmail}/${file.filename}`);
        }

        if (files.govtid) {
            oldFilesToDelete.push(property.govtid); // Collect old govt ID
            updateFields.govtid = `/officialimages/${body.ownerEmail}/${files.govtid[0].filename}`;
        }

        if (files.propertydoc) {
            oldFilesToDelete.push(property.propertydoc); // Collect old property doc
            updateFields.propertydoc = `/officialimages/${body.ownerEmail}/${files.propertydoc[0].filename}`;
        }

        // Update property in MongoDB
        const result = await Property.updateOne({ propertyId: propertyId }, { $set: updateFields });

        if (result.matchedCount > 0) {
            // Only delete old files if the update was successful
            oldFilesToDelete.forEach(deleteFile);
            res.render("updatedetails", {
                email: req.cookies.email,
                success: "Property updated successfully!",
                ownerprofileimage: ownerProfileImage.profilepicture,
            });
        } else {
            res.status(404).send("Property update failed.");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("An error occurred while updating the property.");
    }
};

module.exports = {
    getMyProperty,
    getViewdetails,
    getUpdatedetails,
    postUpdateProperties,
    uploadMultiple1
}