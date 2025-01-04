const getOwnerComplaint=(req,res)=>{
    res.render("ownercomplaint",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getOwnerComplaint
}