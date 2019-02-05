var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../public/server/config/keys");
const passport = require("passport");
const gravatar = require("gravatar");

// Load Input Validation
const validateRegisterInput = require("../public/server/validation/register.validation.js");
const validateLoginInput = require("../public/server/validation/login.validation.js");

// Load User Model
const User = require("../public/server/models/User");
//var mongo = require('mangodb');

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.get('/welcome', function(req, res, next) {
    res.render('welcome', { title: 'Login' });
});

router.get('/main', function(req, res, next) {
    res.render('main', { title: 'main' });
});

router.post("/login", (req, res) => {
    // check validation
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // check password
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);

    User.findOne({ email }).then(user => {
        // check for user
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User Matched
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                };
                // Sign Token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                errors.password = "Password incorrect";
                return res.status(400).json(errors);
            }
        });
    });
});

module.exports = router;
