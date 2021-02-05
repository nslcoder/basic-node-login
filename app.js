const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/users");

const app = express();

const port = process.env.PORT || 3000;
const dbURL = process.env.MONGODB_URL;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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
