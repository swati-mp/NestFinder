const getLogout=(req,res)=>{
    try {
        res.clearCookie("email")
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getLogout
}