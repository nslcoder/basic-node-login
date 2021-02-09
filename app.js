require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");
require("./config/passport-config")(passport);

const app = express();

const port = process.env.PORT || 3000;
const dbURL = process.env.MONGODB_URL;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "lazykeys",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.error = req.flash("error");
    next();
})

// Connect to MongoDB with Mongoose
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
app.use("/", indexRoutes);
app.use("/users", usersRoutes);

app.listen(port, () => console.log(`The server is listening on port ${port}.`));
