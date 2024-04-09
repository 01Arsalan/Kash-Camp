const User = require("../models/user")

module.exports.registerUserForm = (req, res) => {
    res.render("users/register")
}
module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("success", "welcome  to yelp camp")
            res.redirect("/campgrounds")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

module.exports.loginForm = (req, res) => {
    res.render("users/login")
}

module.exports.login = async (req, res) => {
    req.flash("success", "welcome back!")
    const redirectUrl = res.locals.returnTo || "/campgrounds"
    //deletes the "returnTo" on session
    delete res.locals.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logOut(function (err) {
        if (err) return next(err)
        req.flash("success", "Logged Out.")
        res.redirect("/campgrounds")
    })
}