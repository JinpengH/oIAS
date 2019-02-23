const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Load User Model
const User = require("../server/models/User");

//Load Submission Model
const Submission = require("../server/models/Submission");

const validatePostInput = require("../server/validation/post.validation.js");

var router = express.Router();

// Load User Model
const Admin = require(".." +
    "/server/models/Admin");
//var mongo = require('mangodb');
const errors = {message:"",
};

//fixed favicon

router.get('/admin', function(req, res, next) {
    if(req.session.loginUser){
        res.render('main', {title: 'main', user: req.session.loginUser});
    }
    res.render('admin', { error: errors });
});

module.exports = router;
