const getInquriesResponse = (req,res) => {
    res.render("seekerinquiryresponse",{
        email:req.cookies.email,
    })
}

module.exports = {
    getInquriesResponse
}