const jwt=require("jsonwebtoken")

const verifyToken=(req,res,next)=>{
    let token=req.cookies.token;

    if(!token){
        // return res.send(`A token is required for authentication(Please Login)`)
        return res.render("../Auth/login",{
            success:"A token is required for authentication(Please Login)"
        })
    }

    try {
        const decoded=jwt.verify(token,process.env.OWNER_KEY)
        req.user=decoded
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
        // res.send(`Invalid Token(You are not allowed to access this page ): ${error}`)
        return res.render("../Auth/login",{
            success:"Invalid Token(You are not allowed to access this page )"
        })
    }
    return next();
}

module.exports=verifyToken;