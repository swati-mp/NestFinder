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
            // status: body.status,
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

const updateStatus = (socket) => {
    socket.on('updateStatus', async (data) => {
        try {
            const { propertyId, status } = data;
            const updatedStatus = status === "Available" ? "Available" : "Unavailable";
            
            // Update status in the database
            await Property.findOneAndUpdate(
                { propertyId },
                { status: updatedStatus }
            );

            // Emit the updated status back to the client
            socket.emit('statusUpdated', { propertyId, status: updatedStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    });
}

const deleteFile1 = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
                return reject(err);
            }
            resolve();
        });
    });
};
const deleteproperty = async (req, res) => {
    try {
        const propertyId = req.params.id; // Assuming propertyId is sent in the request body
        // console.log(propertyId);
        // Find the property by propertyId
        const property = await Property.findOne({ propertyId });
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Delete related files (images, govtid, propertydoc)
        const fileDeletionPromises = [];

        // Delete images
        if (property.images && property.images.length > 0) {
            property.images.forEach((imagePath) => {
                const fullPath = path.join(__dirname, '../../public', imagePath);
                fileDeletionPromises.push(deleteFile1(fullPath));
            });
        }

        // Delete government ID
        if (property.govtid) {
            const govtidPath = path.join(__dirname, '../../public', property.govtid);
            fileDeletionPromises.push(deleteFile1(govtidPath));
        }

        // Delete property document
        if (property.propertydoc) {
            const propertydocPath = path.join(__dirname, '../../public', property.propertydoc);
            fileDeletionPromises.push(deleteFile1(propertydocPath));
        }

        // Wait for all file deletions to complete
        await Promise.all(fileDeletionPromises);

        // Delete the property from the database
        await Property.deleteOne({ propertyId });

        // return res.status(200).json({ message: "Property and related files deleted successfully" });
        res.redirect("/owner/ownermyproperties");
    } catch (error) {
        console.error("Error deleting property:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getMyProperty,
    getViewdetails,
    getUpdatedetails,
    postUpdateProperties,
    uploadMultiple1,
    updateStatus,
    deleteproperty
}