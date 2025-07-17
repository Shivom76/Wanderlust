const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");

const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const Review=require("../models/review.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {isLoggedIn,isOwner}=require("../middleware.js")

const listingController=require("../controllers/listing.js")

const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})

router
.route("/")
.get(listingController.index)
.post(isLoggedIn,upload.single("listing[image]"),wrapAsync( listingController.createListing ))

// .post(,(req,res)=>{
//     res.send(req.file)
// })

// Create page
router.get("/new",isLoggedIn,listingController.renderNewForm)

router
.route("/:id")
.get(listingController.showListing)
.put(upload.single("listing[image]"),listingController.updateListing)
.delete(isLoggedIn,listingController.destroyListing)


// Show  Page
router.get("/:id",listingController.showListing)

// Update get route
router.get("/:id/edit",isLoggedIn,isOwner, listingController.renderEditForm)


module.exports=router;



    // let newListing=await new Listing({
    //     title:listing.title,
    //     description:listing.description,
    //     price:listing.price,
    //     location:listing.location,
    //     country:listing.country
    // })
