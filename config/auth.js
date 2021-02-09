module.exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } 
    req.flash("errorMsg", "Please provide correct login credentials.");
    res.redirect("/users/login");
}

