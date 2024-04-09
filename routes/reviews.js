const express = require("express")
//mergeParams:true-- router keeps seperate with params,if not mentioned in routes (in this case "params" are mentioned in app.use middleware), to get access to params, pass this option
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync")
const {validateReview,isLoggedin,isReviewAuthor}=require("../middlewae")
const reviews=require("../controllers/reviews")


//adding review
router.post("/",isLoggedin, validateReview, wrapAsync(reviews.createRerview))

// deleting reviews
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(reviews.deleteRerview))


module.exports = router