const { Property } = require("../../model/Owner/PropertySchema")
const fs = require('fs');
const path = require('path');
const { OwnerNotification } = require("../../model/Owner/ownernotificationSchema");

const getApproveProperties = async (req, res) => {
    try {
        const properties = await Property.find({ approved: false })
        res.render("approveproperties", {
            adminname: process.env.Admin_Name,
            properties: properties
        })
    } catch (error) {
        console.log(error)
    }
}

const getViewImages = async (req, res) => {
    try {
        const property = await Property.findOne({ propertyId: req.params.propertyId });
        // console.log(property)
        if (property) {
            res.render('viewImages', {
                images: property.images,
                propertyId: req.params.propertyId,
                ownerEmail: property.ownerEmail,
                propertytitle: property.title
            });
        } else {
            res.status(404).send('Property not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error loading images');
    }
}

const postApproveProperties = async (req, res) => {
    try {
        // console.log(req.body)
        const result = await Property.updateOne(
            { ownerEmail: req.body.email, propertyId: req.body.propertyId },
            { $set: { approved: true } }
        );
        // console.log(result)
        const properties = await Property.find({ approved: false })
        if (result.modifiedCount > 0) {
            res.render("approveproperties", {
                adminname: process.env.Admin_Name,
                properties: properties,
                message: "Property approved successfully."
            })
        } else {
            res.render("approveproperties", {
                adminname: process.env.Admin_Name,
                properties: properties,
                message: "Property not found or already approved."
            })
        }
    }
    catch (error) {
        console.log(error)
    }
}

const postRejectProperties = async (req, res) => {
    try {
        const property = await Property.findOne({ ownerEmail: req.body.email, propertyId: req.body.propertyId });

        // Delete the images from the folder
        for (const imagePath of property.images) {
            const fullPath = path.join(__dirname, '../../public', imagePath);
            await fs.promises.unlink(fullPath);
        }

        // Create a notification for the owner
        const notification = new OwnerNotification({
            ownerEmail: req.body.email,
            notification: `Your property with ID ${req.body.propertyId} has been rejected. Reason: ${req.body.rejectReason}. Please re-upload the property with the necessary changes.`,
        });

        // Save the notification to the database
        await notification.save();

        // console.log(req.body)
        const result = await Property.deleteOne(
            { ownerEmail: req.body.email, propertyId: req.body.propertyId }
        );
        // console.log(result)
        const properties = await Property.find({ approved: false })
        if (result.deletedCount > 0) {
            res.render("approveproperties", {
                adminname: process.env.Admin_Name,
                properties: properties,
                message: "Property rejected successfully."
            })
        } else {
            res.render("approveproperties", {
                adminname: process.env.Admin_Name,
                properties: properties,
                message: "Property not found or already rejected."
            })
        }
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    getApproveProperties,
    getViewImages,
    postApproveProperties,
    postRejectProperties
}