const getBlockOwner=(req,res)=>{
    res.render("blockowner",{
        adminname:process.env.Admin_Name
    })
}

module.exports={
    getBlockOwner
}