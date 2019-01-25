const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connet to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => console.log(err));