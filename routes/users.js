const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register an account
router.post("/register", (req, res) => {
    const { password } = req.body;
    
    bcrypt.hash(password, 10, async function(err, hash) {
        if(err) return console.log(err);
        req.body.password = hash;
        await User.create(req.body);
        res.redirect("/");
    })
})

// Login
router.post("/login", passport.authenticate("local", { failureRedirect: "/login"}), 
    function(req, res) {
        res.render("dashboard", { username: req.body.username });
})

// Logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

module.exports = router;