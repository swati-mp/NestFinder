const getUnblockSeeker=(req,res)=>{
    res.render("unblockseeker",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getUnblockSeeker
}