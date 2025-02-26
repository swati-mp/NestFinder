const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const PropertySchema = new mongoose.Schema({
    propertyId: { type: String},
    title: { type: String, required: true },
    description: { type: String, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    address: {
        locality: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String,default:"Belgaum", required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true },
    },
    ownerPhone: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    images: [String], // Array to store image paths
    govtid: { type: String },          // Added for Government ID file path
    propertydoc: { type: String },     // Added for Property Document file path
    mapLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    datePosted: { type: Date, required: true },
    status: { type: String, enum: ["Available", "Unavailable"], required: true },
    approved: { type: Boolean, default: false }
});

PropertySchema.pre("save", function (next) {
    if (!this.propertyId) {
        this.propertyId = uuidv4().toString();  // Using Unix timestamp for unique ID
    }
    next();
})   

const Property = mongoose.model("Property", PropertySchema);

module.exports = {
    Property
}
