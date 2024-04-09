const { campgroundValidationSchema,reviewValidationSchema } = require("./schemas")
const campGround = require("./models/campGround")
const Review = require("./models/reviews")
const ExpressError = require("./utils/ExpressError")




module.exports.isLoggedin=(req,res,next)=>{
    if(req.isAuthenticated()) return next()
    //also needed to get "returnTo"---because of redirect.
    req.session.returnTo=req.originalUrl
    req.flash("error","you must be logged in first!")
    res.redirect("/login")
}
//this middleware () saves the returnTo value from the session (req.session.returnTo) to res.locals
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundValidationSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}

module.exports.isAuthor= async(req,res,next)=>{
    let camp = await campGround.findById(req.params.id)
    if(!camp.author.equals(req.user._id)){
        req.flash("error","You are no allowed to do that!")
        return res.redirect(`/campgrounds/${camp._id}`)
    }
    next()
}


//validation middleware ()

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}

module.exports.isReviewAuthor= async(req,res,next)=>{
    const {id,reviewId}= req.params
    let review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are no allowed to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}