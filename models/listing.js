const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js")
const User=require("./user.js");


const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String,
        // set:(v)=>{v===""?"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60":v}    // hata skte agar jaroorat na ho to
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {type:Schema.Types.ObjectId,
        ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
        await Review.deleteMany({_id:{$in: listing.reviews}})
    }
    console.log("something got deleted")

})

const Listing= mongoose.model("Listing",listingSchema);

module.exports=Listing;