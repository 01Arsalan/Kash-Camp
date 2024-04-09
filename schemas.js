const joi = require("joi")

const campgroundValidationSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().min(0).required(),
        // image: joi.string().required(),
        location: joi.string().required(),
        discription: joi.string().required()
    }).required(),
    imgData: joi.string()

})

const reviewValidationSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().min(1).max(5).required()
    }).required()
})

module.exports = { campgroundValidationSchema, reviewValidationSchema }