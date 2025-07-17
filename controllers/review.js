const Listing=require("../models/listing.js")
const Review=require("../models/review.js")


module.exports.updateReview=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!")

    console.log("New review savedd")
    console.log(newReview)
    res.redirect(`/listing/${id}`)
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("deletedMsg","The review was deleted")  // not getting flash messagee

    res.redirect(`/listing/${id}`);
}