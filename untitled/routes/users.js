var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../server/config/keys");
const passport = require("passport");
const gravatar = require("gravatar");

var router = express.Router();

// Load Input Validation
const validateRegisterInput = require("../server/validation/register.validation.js");
const validateLoginInput = require("../server/validation/login.validation.js");

// Load User Model
const User = require("../server/models/User");

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
/*
router.get("/test", (req, res) =>
    res.json({
      msg: "User Works"
    })
);*/


// @route   GET api/users/current
// @desc    Return current user
// @access  Private
/*
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      });
    }
);*/

module.exports = router;


