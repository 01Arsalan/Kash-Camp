const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const { isLoggedin, validateCampground, isAuthor } = require("../middlewae")
const campgrounds = require("../controllers/campgrounds")

const multer = require("multer")
const { storage } = require("../cloudinary/index")
const upload = multer({ storage })

router.route("/")
    .get(wrapAsync(campgrounds.index))
    // saving new campground
    .post(isLoggedin, upload.array("image"), validateCampground, wrapAsync(campgrounds.createCampground))


//"upload.single("image")|| upload.array("image")" prameter in single() should match the form field name
// .post(upload.array("image"),(req,res)=>{
//     console.log(req.body,req.files)
//     res.send("done")
// })

router.get("/new", isLoggedin, campgrounds.renderNewForm)

router.route("/:id")
    //show
    .get(wrapAsync(campgrounds.showCamoground))
    //update
    .put(isLoggedin, isAuthor,upload.array("image"), validateCampground, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedin, isAuthor, wrapAsync(campgrounds.deleteCampground))


router.get("/:id/edit", isLoggedin, isAuthor, wrapAsync(campgrounds.editCampground))




module.exports = router



