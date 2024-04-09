const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./reviews")

// to get virtual (popupHTML) included when stingifying
const optns={toJSON:{virtuals:true}}


const imageSchema=new Schema({
    url: String,
    filename: String
})
//defing a  virtual property on image schema, to generate url's for cloudinary api-- for thumbnail images
imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_300")
})
const campGroundSchema = new Schema({
    title: String,
    //nesting imageSchema in campground schema.
    images: [imageSchema],
    //needs elucidation
    geometry:{
        type:{
            type:String,
            emum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price: Number,
    discription: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
},optns)

//to create property for cluster map popups ---  why not this.thumbnail
campGroundSchema.virtual("properties.popupHTML").get(function(){
    return ` <div>
                <img src="${this.images[0]? this.images[0].url.replace("/upload","/upload/w_300") : `..`}"  style="width:100%;height:100px;" overflow:hidden>
                <h3><a href="/campgrounds/${this._id}">${this.title}</a></h3>
                <p>${this.discription.substring(0,30)}...</p>
            </div>`
})


// mongoose middle-ware that wil be triggered if a camp is deleted by "findOneAndDelete()"
//callback will recieve the deleted doc. as an argument
campGroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        // remove  all docs from Review where _id is equal to any _id in doc.reviews
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})



module.exports = mongoose.model("Campground", campGroundSchema)



