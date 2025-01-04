const getSeekerdata =(req, res) => {
    res.render("seekerdata",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getSeekerdata
}