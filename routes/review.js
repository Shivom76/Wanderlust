const express=require("express");
const router=express.Router({mergeParams:true});
const mongoose=require("mongoose");

const wrapAsync=require("../utils/WrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js")
const listingRouter=require("../routes/listing.js")
const {isLoggedIn,isReviewAuthor}=require("../middleware.js")

const reviewController=require("../controllers/review.js")

// Reviews route 

router.post("/",isLoggedIn,wrapAsync(reviewController.updateReview));

// Reviews delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;