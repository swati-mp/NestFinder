const getLogout=(req,res)=>{
    try {
        // Remove the added cookies after logout
        res.clearCookie("email")
        res.clearCookie("token")
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    getLogout
}