const { updateStatus } = require("../controllers/Owner/mypropertiesController");
const {postAddToWishlist}=require("../controllers/Seeker/seekerController")

module.exports = function(io) {
    const countusers=[]
    io.on('connection', socket => {
        const cookies = socket.request.headers.cookie;
        const email = cookies.split('; ').find(cookie => cookie.startsWith('email=')).split('=')[1];
        countusers.push(decodeURIComponent(email))
        io.emit("onlineusers",new Set(countusers).size)

        socket.on('disconnect', () => {
            countusers.splice(countusers.indexOf(decodeURIComponent(email)),1)
            io.emit("onlineusers",new Set(countusers).size)
        });

        updateStatus(socket);
        postAddToWishlist(socket);
    });
};