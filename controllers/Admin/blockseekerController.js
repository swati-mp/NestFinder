const getBlockSeeker=(req,res)=>{
    res.render("blockseeker",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getBlockSeeker
}