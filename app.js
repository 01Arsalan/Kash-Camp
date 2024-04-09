if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const campgroundRoutes = require("./routes/campground")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/user")
const User = require("./models/user")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const ExpressMongoSanitize = require("express-mongo-sanitize")



const MongoStore=require("connect-mongo")


const dbUrl=process.env.DB_URL
//'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl, {
    // for express_4.0
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    //useFindAndModify:false
})
    .then(() => {
        console.log("connected To DB.")
    })
    .catch((err) => {
        console.log("Connection To DB Failed,Error : ", err)
    })


const app = express()

//configureting app
//engine for ejs
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))



//middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
//serving public dir.
app.use(express.static(path.join(__dirname, 'public')))



const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,//lazy session save
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error",function(e){
    console.log("session store error",e)
})



const sessionConfig = {
    store,
    name:"not_default",
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //cookies accessible & configured only over https-(local host is not https)
        // secure:true,
        //setting expiration for a week
        expires: Date.now() * 1000 * 60 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 60 * 24 * 7,

    }
    //store is for now default
}
app.use(session(sessionConfig))

app.use(flash())

app.use(passport.initialize())


// for persistant login sessions- this must be used, and it must come after "express-session" 
app.use(passport.session())
// telling "passport", we are using "localStrategy" and authentication method for "localStrategy" is in "User.authenticate()", which is added by "passportLocalModel"
passport.use(new localStrategy(User.authenticate()))
// telling pass how to serialize user(how to strore data in the session)
passport.serializeUser(User.serializeUser())
//opposite of serialize
passport.deserializeUser(User.deserializeUser())


//creating locals(globals)
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

//security from mongo injection
app.use(ExpressMongoSanitize({replaceWith:"_"}))



app.use("/", userRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)





app.get("/", (req, res) => {
    res.render('home')
})


// this will execute only when none of the upper router are matched and for all kind of requests.
//(safety machenism for unvalid url's)
app.all("*", (req, res, next) => {
    // this error will be passed to error handling middleweare.
    next(new ExpressError(404, "Path Not Found!!!"))
})



// error handling middleware.
app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message == "Oh no!,something went wrong."
    res.status(status).render("error", { err })
})




app.listen(3000, () => {
    console.log("Serving On Port 3000")
})
