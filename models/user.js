const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        //this is not validation
        unique: true
    },
})

// this will add on our schema, a pass, a username. will make sure usernames are unique and gives us some methods to use
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)