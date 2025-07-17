const Listing=require("../models/listing.js")

module.exports.index=async (req,res)=>{
    let allListing=await Listing.find({});
    res.render("listing.ejs",{allListing});   
}

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user)
    res.render("new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({path:"reviews",
    populate:{
        path:"author"
    }})
    .populate("owner");
    console.log(data)
    if (!data){
         req.flash("error","The Listing was not present");
        res.redirect("/listing")
    }
    res.render("show.ejs",{data});
}

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image = { url: url, filename: filename }; 
    await console.log(newListing.image.url)
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listing");
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);

    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_250,w_300")
    res.render("edit.ejs",{data,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    console.log(listing);
    req.flash("success","The listing was updated")
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);

    if (!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner");
        
    }
    if (listing.owner._id.equals(res.locals.currUser._id)){
        deletedListing=await Listing.findByIdAndDelete(id);
        console.log(deletedListing);                            // there is somme issue with deketion console and flash
        req.flash("deletedMsg","The listing was deleted")
    }
    res.redirect(`/listing/${id}`);
}