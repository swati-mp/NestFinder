const { updateStatus } = require("../controllers/Owner/mypropertiesController");

module.exports = function(io) {
    io.on('connection', socket => {
        console.log('Client connected');
        updateStatus(socket);
    });
};