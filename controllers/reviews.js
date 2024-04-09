const campGround = require("../models/campGround")
const Review = require("../models/reviews")

module.exports.createRerview=async (req, res) => {
    req.flash("success","Review Added")
    const camp = await campGround.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author=req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.deleteRerview=async (req, res) => {
    req.flash("success","Review Deleted")
    const { id, reviewId } = req.params
    await campGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}