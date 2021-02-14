const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

// Register an account
router.post("/register", async (req, res) => {
    /* const { username, name, email, password, password2 } = req.body; */
    await User.create(req.body);
    res.redirect("/");
})

// Login
/* router.post("/login", async (req, res) => {
    await User.find({ username: req.body.username, password: req.body.password });
    res.render("dashboard", { username: req.body.username});
}) */

router.post("/login", passport.authenticate("local", { failureRedirect: "/login"}), 
    function(req, res) {
        res.render("dashboard", { username: req.body.username });
    })


module.exports = router;