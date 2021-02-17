require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const bcrypt = require("bcrypt");

const usersRoutes = require("./routes/users");
const User = require("./models/User");

// Specify the passport strategy to use 
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function(err, result) {
            if(err) return console.log(err);
            if(!result) {
                return done(null, false, { message: "Incorrect password" });
            } else {
                return done(null, user);
            }
        });
      });
    }
  ));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

const app = express();

// Environment variables 
const port = process.env.PORT || 3000;
const dbURL = process.env.MONGODB_URL;

// Set up a view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "psycat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB via Mongoose
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Database connected.");
    })
    .catch(err => {
        console.log(err);
    });

// Routes
app.get("/", (req, res) => {
    res.render("index");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.use("/apis", usersRoutes);

// Listen at port
app.listen(port, () => {
    console.log(`The server is listening at port ${port}.`);
})
