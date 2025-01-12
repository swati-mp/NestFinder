const { ownercomplaints } = require("../../model/Owner/ownercomplaintsSchema");
const {owners}=require("../../model/Owner/ownerSchema");
const { Property } = require("../../model/Owner/PropertySchema");
const { seekercomplaints } = require("../../model/Seeker/seekercomplaintsSchema");
const {seekers}=require("../../model/Seeker/seekerSchema");


const getAdmin =async(req, res) => {
    try {
        const totalowners=await owners.find().countDocuments();
        const totalseekers=await seekers.find().countDocuments();
        const totalproperties=await Property.find().countDocuments();
        const pendingproperties=await Property.find({approved:false}).countDocuments();
        const approvedproperties=await Property.find({approved:true}).countDocuments();
        const ownercomplaint=await ownercomplaints.find().countDocuments();
        const seekercomplaint=await seekercomplaints.find().countDocuments();
        const blockedowners=await owners.find({blocked:true}).countDocuments();
        const blockedseekers=await seekers.find({blocked:true}).countDocuments();
        const totaluniquecities=await Property.distinct("address.city").countDocuments();

        res.render("admin",{
            adminname:process.env.Admin_Name,
            totalowners:totalowners,
            totalseekers:totalseekers,
            totalproperties:totalproperties,
            pendingproperties:pendingproperties,
            approvedproperties:approvedproperties,
            ownercomplaint:ownercomplaint,
            seekercomplaint:seekercomplaint,
            blockedowners:blockedowners,
            blockedseekers:blockedseekers,
            totaluniquecities:totaluniquecities
        })
    } catch (error) {
        console.log(error)     
    }
}

module.exports={
    getAdmin
}