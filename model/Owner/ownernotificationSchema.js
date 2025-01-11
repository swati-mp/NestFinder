const mongoose = require('mongoose');

const ownernotificationSchema = new mongoose.Schema({
    ownerEmail: {
        type: String,
        required: true
    },
    notification: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const OwnerNotification = mongoose.model('OwnerNotification', ownernotificationSchema);

module.exports = {
    OwnerNotification
};