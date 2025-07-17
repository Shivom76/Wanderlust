const User = require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("signup.ejs")
}

module.exports.signup=async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        let newUser=new User({email,username})
        const registeredUser=await User.register(newUser,password)

        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
            }
            console.log(registeredUser)
            req.flash("success","Welcome to WanderLust")
            return res.redirect("/listing");
        })


    }catch(e){
        console.log(e.message)
        req.flash("error",e.message)
        return res.redirect("/signup")
    }
}


module.exports.renderLoginForm=(req,res)=>{
    res.render("login.ejs")
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome  back, User");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl)

}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You have been logged Out!");
        res.redirect("/listing")
    })
}