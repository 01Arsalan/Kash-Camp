const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync")
const { storeReturnTo } = require('../middlewae');
const passport = require("passport")
const users = require("../controllers/users")

router.route("/register")
    .get(users.registerUserForm)
    .post(wrapAsync(users.registerUser))

router.route("/login")
    .get(users.loginForm)
    //"passport.authenticate()" is a middleware that authenticates the user
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login)

//logout function is added by "passport"
router.get("/logout", users.logout)


module.exports = router