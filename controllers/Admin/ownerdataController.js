const getOwnerdata =(req, res) => {
    res.render("ownerdata",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getOwnerdata
}