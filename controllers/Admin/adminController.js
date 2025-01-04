const getAdmin =(req, res) => {
    res.render("admin",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getAdmin
}