// made this js file to delete the empty reviews created by mistake

const mongoose=require("mongoose");
const Listing=require("../models/listing");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err)
})

let del=async()=>{
    let listing=await Listing.findById('6816f03a92f6224ec7584cca');

    listing.reviews=[];
    await listing.save()
}
// del();