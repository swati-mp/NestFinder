const getSeekerComplaint=(req,res)=>{
    res.render("seekercomplaint",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getSeekerComplaint
}