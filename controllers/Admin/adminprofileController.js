const getAdminProfile=(req,res)=>{
    res.render("adminprofile",{
        adminname:process.env.Admin_Name,
        adminemail:process.env.Admin_Email
    })
}

module.exports={
    getAdminProfile
}