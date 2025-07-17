if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js")
const Review=require("./models/review.js")
const session=require("express-session");
const mongoStore=require("connect-mongo");
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")

const app=express();

app.listen(8080,()=>{
 console.log("8080 is listening")
})

app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.set("views",[
    path.join(__dirname,"/views/listings"),
    path.join(__dirname,"/views/layouts"),
    path.join(__dirname,"/views/users")
    ]);
app.set("models",path.join(__dirname,"/models"));
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));


const dbUrl=process.env.ATLASDB_URL

const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on(()=>{
    console.log("ERROR IN MONGO DB STORE")
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000
    }
}

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(dbUrl);
    // await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err)
})

app.get("/",(req,res)=>{
    res.send("Home pagee")
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.deletedMsg=req.flash("deletedMsg");
    res.locals.error=req.flash("error")    //errorMsg se error kiya hai idhar [Can get error somewhere cause of this]
    res.locals.currUser=req.user;
    next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter)

app.use((err,req,res,next)=>{
    let{statusCode,message}=err
    res.status(statusCode=404).send(message);
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     })

//     let registereduser=await User.register(fakeUser,"helloworld")
//     console.log(registereduser)
//     res.send(registereduser);
// })




// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found!"));
// })