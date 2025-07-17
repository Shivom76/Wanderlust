const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
// const User = require("../models/user.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js")


const userController=require("../controllers/user.js")

router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}),
    userController.login)
    
router
.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup)

router.get("/logout",userController.logout)

module.exports=router;


// router.get("/login",userController.renderLoginForm)

// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}),
//     userController.login)