const campGround = require("../models/campGround")
const ExpressError = require("../utils/ExpressError")
const { cloudinary } = require("../cloudinary/index")
//for geocoding --selected requirements
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAPBOX_TOKEN
//creating service client
const geoCoder = mbxGeocoding({ accessToken: mapboxToken })

module.exports.index = async (req, res) => {

    let page=0
    let limit=5


    if(req.query.p){
        page=parseInt(req.query.p) || 1
        limit=5
    
        const skip=(page-1)*limit
    
        const campgrounds = await campGround.find({})
        .skip(skip)
        .limit(limit)
    
        return res.json(campgrounds)
    }

    const campgrounds = await campGround.find({})
    .skip(page)
    .limit(limit)
    res.render("campgrounds/index", { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res) => {
    //geo-coding
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    req.flash("success", "Successfully Made A Campground")
    //if req is sent (using api and "campground" key is missing) with invalid data, this error will be thrown.
    // if(!req.body.campground) throw new ExpressError(400,"Invalid Campground Data!.")
    // OR
    //we can use "joi" validation and pass it in parameters(validateCampground)

    const newCamp = new campGround(req.body.campground)
    //getting data from "clodinary" and saving it
    //this will create a array of obj.'s with url and file name as properties
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCamp.author = req.user._id
    newCamp.geometry = geoData.body.features[0].geometry
    await newCamp.save()
    res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.showCamoground = async (req, res) => {
    await campGround.findById(req.params.id).populate(
        {//populate all the reviews and  nested populate is telling mongoose to populate author which is on each review
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate("author")
        .then((camp) => {
            //if camp is not found
            if (!camp) {
                req.flash("error", "Couldn't find your camp")
                return res.redirect("/campgrounds")
            }
            return camp
        })
        .then((camp) => {
            res.render("campgrounds/show", { camp })
        })
        //if id is not a id
        .catch((err) => {
            req.flash("error", "Couldn't find your camp")
            res.redirect("/campgrounds")
        })
}

module.exports.editCampground = async (req, res) => {
    const camp = await campGround.findById(req.params.id)
    res.render("campgrounds/edit", { camp })
}

module.exports.updateCampground = async (req, res) => {
    //we have to parse "req.body.imgData" coz it was stringified upon sending.
    const imgDataArray = JSON.parse(req.body.imgData);

    if (!req.body.campground) throw new ExpressError(401, "Invalid Campground Data!.")
    //using spread operator in second parameter
    camp = await campGround.findByIdAndUpdate(req.params.id, { ...req.body.campground })
    //this map will return a array of obj.'s
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    //here we are spreading that array (...) and passing each obj. and push it onto images array on camp.
    camp.images.push(...imgs)
    await camp.save()
    // pull is used to delete elements in an array, "pull out of images-array where filename matches any on the filenames in imgData"
    if (req.body.imgData) {
        //deleting selected images from cloudinary
        for (let filename of imgDataArray) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: imgDataArray } } } }, { new: true })
    }

    req.flash("success", "Successfully Updated Campground")
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    req.flash("success", "Successfully Deleted Campground")
    await campGround.findByIdAndDelete(req.params.id)
    res.redirect("/campgrounds")
}
