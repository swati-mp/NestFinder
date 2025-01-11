const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Property } = require("../../model/Owner/PropertySchema");

const getAddProperty=(req,res)=>{
    res.render("owneraddproperties",{
        email:req.cookies.email
    })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userEmail = req.body.ownerEmail; // Retrieve email from form
        const dir = path.join(__dirname, "../../public/officialimages", userEmail);

        // Create directory if it doesn't exist
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

const postAddProperties=async(req,res)=>{
    try {
        const { body, files } = req;

        if(!body.latitude || !body.longitude){
            return res.render("owneraddproperties",{
                email:req.cookies.email,
                success:"Please select the location on map."
            })
        }

        // Store file paths
        const imagePaths = files.map((file) => `/officialimages/${body.ownerEmail}/${file.filename}`);

        // Create property object
        const property = new Property({
            title: body.title,
            description: body.description,
            rent: body.rent,
            deposit: body.deposit,
            address: {
                street: body.street,
                city: body.city,
                state: body.state,
                zipcode: body.zipcode,
            },
            ownerPhone: body.ownerPhone,
            ownerEmail: body.ownerEmail,
            bedrooms: body.bedrooms,
            bathrooms: body.bathrooms,
            images: imagePaths,
            mapLocation: {
                latitude: body.latitude,
                longitude: body.longitude,
            },
            datePosted: body.datePosted,
            status: body.status,
        });

        // Save property to database
        await property.save();
        res.render("owneraddproperties",{
            email:req.cookies.email,
            success: "Property added successfully!",   
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getAddProperty,
    postAddProperties,
    upload,
}

