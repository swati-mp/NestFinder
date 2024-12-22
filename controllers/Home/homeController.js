const getHome= (req, res) => {
    res.render("home")
}

const getAboutUs=(req,res)=>{
    res.render("aboutus")
}

module.exports={
    getHome,
    getAboutUs
}