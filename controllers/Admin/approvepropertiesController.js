const getApproveProperties=(req,res)=>{
    res.render("approveproperties",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getApproveProperties
}