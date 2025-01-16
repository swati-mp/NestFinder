const mongoose = require('mongoose');

const seekernotificationSchema = new mongoose.Schema({
    seekerEmail: {
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

const SeekerNotification = mongoose.model('SeekerNotification', seekernotificationSchema);

module.exports = {
    SeekerNotification
};