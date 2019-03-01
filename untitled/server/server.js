const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("../routes/users");
const index = require("../routes/index");
const submission = require("../routes/submission");
const admin = require("../routes/admin");
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS support
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/users", users);
app.use("/submission", submission);
app.use("/adminlogin", admin);

const port = process.env.PORT || 8081;

app.listen(port, () => console.log(`Server running on port ${port}`));
