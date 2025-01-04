const getProperties=(req,res)=>{
    res.render("adminproperties",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getProperties
}