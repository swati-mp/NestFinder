const getSubmittedInquries = (req,res) => {
    res.render("submittedinquires",{
        email:req.cookies.email,
    })
}

module.exports = {
    getSubmittedInquries
}