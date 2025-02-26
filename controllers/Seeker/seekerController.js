const { Property } = require("../../model/Owner/PropertySchema");
const { seekers } = require("../../model/Seeker/seekerSchema")

const getSeeker = async (req, res) => {
    try {
        const seeker = await seekers.findOne({ email: req.cookies.email }).select("address.city");
        const seekerprofileimage=await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        // console.log(ownerprofileimage)
        if (!seeker || !seeker.address || !seeker.address.city) {
            // console.log("City not found for the seeker.");
            // return res.status(404).send("Owner's city not found.");
            const allproperties = await Property.find({ status: "Available", approved: true });
            return res.render("seeker", { 
                liveproperties: allproperties,
                notice:"Update your profile to list properties based on your city",
                seekerprofileimage:seekerprofileimage.profilepicture,
                email:req.cookies.email 
            });
        }

        const seekerCity = seeker.address.city; // Extract the owner's city
        const query = {};

        // Implement the regular expression for the city
        if (seekerCity.length >= 4) {
            const firstTwo = seekerCity.slice(0, 2); // First two letters
            const lastTwo = seekerCity.slice(-2);   // Last two letters
            query["address.city"] = new RegExp(`^${firstTwo}.*${lastTwo}$`, "i");
        } else {
            query["address.city"] = new RegExp(`^${seekerCity}`, "i");
        }

        // Add other filters to the query
        query.status = "Available";
        query.approved = true;

        const liveproperties = await Property.find(query);

        // console.log("Query:", query);
        // console.log("Live Properties:", liveproperties);

        res.render("seeker", { 
            liveproperties,
            seekerprofileimage:seekerprofileimage.profilepicture,
            email:req.cookies.email 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Server error.");
    }
};

const getViewdetails = async (req, res) => {
    try {
        // console.log(req.params.id)
        const viewdetailsdata = await Property.findOne({ propertyId: req.params.id })
        const seekerprofileimage = await seekers.findOne({ email: req.cookies.email }).select("profilepicture")
        const seekerwislistdata = await seekers.findOne({ email: req.cookies.email }).select("wishlist");
        const isInWishlist = seekerwislistdata.wishlist.includes(req.params.id);
        let selected = "";
        if (isInWishlist) {
            selected = "selected";
        }
        // console.log(viewdetailsdata)
        res.render("viewdetails", { 
            property: viewdetailsdata,
            email: req.cookies.email,
            seekerprofileimage: seekerprofileimage.profilepicture,
            selected: selected
        })
    }
    catch (error) {
        console.log(error)
    }
}

const postSearchProperties = async (req, res) => {
    try {
        // console.log("Request Body:", req.body);
        const { criteria, searchvalue } = req.body;
        let query = { approved: true, status: "Available" };

        if (criteria === "city") {
            // Ensure the search value has enough length
            if (searchvalue.length >= 4) {
                const firstTwo = searchvalue.slice(0, 2);  // First two letters
                const lastTwo = searchvalue.slice(-2);     // Last two letters
                query["address.city"] = new RegExp(`^${firstTwo}.*${lastTwo}$`, 'i'); 
            } else {
                query["address.city"] = new RegExp(`^${searchvalue}`, 'i'); 
            }
        } else if (criteria === "rent") {
            query.rent = { $lte: parseFloat(searchvalue) }; // Ensure rent is compared numerically
        } else if (criteria === "rooms") {
            query.bedrooms = parseInt(searchvalue); // Ensure numeric comparison for rooms
        } 
        const seekerprofileimage=await seekers.findOne({ email: req.cookies.email }).select("profilepicture")

        const approvedProperties = await Property.find(query);
        // console.log("approvedProperties:", approvedProperties);
        res.render("seeker", {
            liveproperties: approvedProperties,
            seekerprofileimage:seekerprofileimage.profilepicture,
            email:req.cookies.email 
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).send("An error occurred while fetching properties.");
    }
};

const postAddToWishlist = async (socket) => {
    socket.on("save-to-wishlist", async (data) => {
        const { propertyId } = data;
        // console.log("Property ID:", propertyId);

        try {
            // Parse cookies from the socket request
            const cookies = socket.request.headers.cookie;
            if (!cookies) throw new Error("No cookies found");
            const emailCookie = cookies
                .split("; ")
                .find((cookie) => cookie.startsWith("email="));
            if (!emailCookie) throw new Error("Email not found in cookies");

            const email = decodeURIComponent(emailCookie.split("=")[1]);

            // Fetch the user document
            const user = await seekers.findOne({ email });
            if (!user) {
                return socket.emit("error", {
                    message: "User not found",
                });
            }

            // Check if the property is already in the wishlist
            const isInWishlist = user.wishlist.includes(propertyId);

            if (isInWishlist) {
                // Remove the property from the wishlist
                await seekers.updateOne(
                    { email },
                    { $pull: { wishlist: propertyId } }
                );
                socket.emit("wishlist-removed");
            } else {
                // Add the property to the wishlist
                await seekers.updateOne(
                    { email },
                    { $addToSet: { wishlist: propertyId } }
                );
                socket.emit("wishlist-updated");
            }
        } catch (error) {
            console.error("Error in wishlist operation:", error);
            socket.emit("error", {
                message: "An error occurred while saving to wishlist",
            });
        }
    });
};

const postFilterProperties=async (req,res)=>{
    try {
        const { city, locality } = req.body; // Extract city and locality from form submission
        let query = { approved: true, status: "Available" };

        if (city) {
            query["address.city"] = new RegExp(`^${city}$`, 'i'); // Exact match for city (case insensitive)
        }

        if (locality) {
            query["address.locality"] = new RegExp(`^${locality}$`, 'i'); // Exact match for locality
        }

        // Fetch seeker's profile picture
        const seekerProfile = await seekers.findOne({ email: req.cookies.email }).select("profilepicture");

        // Fetch approved properties based on the query
        const approvedProperties = await Property.find(query);

        res.render("seeker", {
            liveproperties: approvedProperties,
            seekerprofileimage: seekerProfile ? seekerProfile.profilepicture : null,
            email: req.cookies.email,
            locality:locality
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).send("An error occurred while fetching properties.");
    }
}

module.exports={
    getSeeker,
    getViewdetails,
    postSearchProperties,
    postAddToWishlist,
    postFilterProperties
}