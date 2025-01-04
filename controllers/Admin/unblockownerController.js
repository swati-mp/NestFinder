const getUnblockOwner=(req,res)=>{
    res.render("unblockowner",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getUnblockOwner
}