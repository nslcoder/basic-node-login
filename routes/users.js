const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check if any field is empty
    if(!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill all the fields." });
    }

    // Check if password and password2 match
    if(password !== password2) {
        errors.push({ msg: "Password fields don't match." });
    }

    // Check if the password is less than 6 characters 
    if(password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters long." });
    } 
   
    if(errors.length > 0) {
        res.render("register", { errors, name, email, password, password2 });
    } else {
        await User.findOne({ email: email }, (err, user) => {
            if(err) {
                console.log(err);
            }

            if(user) {
                errors.push({ msg: "Email is already registered." });
                res.render("register", { errors, name, email, password, password2 });
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });
        
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                          .then(value => {
                              console.log(value);
                              req.flash("successMsg", "You are now registered.");
                              res.redirect("/users/login");
                          })
                          .catch(error => {
                              console.log(error);
                          })
                    })
                })
            }
        })

    }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    flashFailure: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("successMsg", "You are logged out.");
    req.redirect("/users/login");
});

module.exports = router;