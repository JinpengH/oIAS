var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../public/server/config/keys");
const passport = require("passport");
const gravatar = require("gravatar");

var router = express.Router();

// Load Input Validation
const validateRegisterInput = require("../public/server/validation/register.validation.js");
const validateLoginInput = require("../public/server/validation/login.validation.js");

// Load User Model
const User = require("../public/server/models/User");
//var mongo = require('mangodb');
const errors = {message:"",
   };
/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('login', { error: errors });
});

router.get('/', function(req, res, next) {
    res.render('login', { error: errors });
});
function mainGet(req,res,next){
    //const name = req.name;
    //const user = req.user;
    //res.render('main', { title: 'main', name, user});
    res.render('main', { title: 'main'});
}
router.get('/main',mainGet);

router.get('/statistic', function(req, res, next) {
    res.render('statistic', { title: 'stat' });
});
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'profile' });
});

function loginPost(req,res,next){
    // check validation
    /*const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.render('login',{error: errors});
        //return res.status(400).json(errors);
    }
    */

    // check password
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        // check for user
        if (!user) {
            errors.message = "Email/Password combination incorrect, please check again";
            return res.render('login',{error: errors});
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User Matched
                const payload = {
                    id: user.id,
                    name: user.fullName,
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

                req.user = user;
                res.render('main', {user});

            } else {
                errors.message = "Email/Password combination incorrect, please check again";
                return res.render('login',{error: errors});
                //return res.status(400).json(errors);
            }
        });
    });
}
router.post("/login", loginPost, mainGet);
/*
router.post("/login", (req, res) => {
    // check validation
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // check password
    const email = req.body.email;
    const password = req.body.password;

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

                //res.send()
                return res.redirect('/main');
                //res.render('main', { title: 'main', email});
            } else {
                errors.password = "Password incorrect";
                return res.status(400).json(errors);
            }
        });
    });
});
*/


router.post("/register", (req, res) => {
    // check validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const employeeId = req.body.employeeId;
    const email = req.body.employeeId;

    User.findOne({ employeeId }).then(user => {
        if (user) {
            errors.message = "This employee ID is associated with an existing account.";
            res.render('login', { error: errors });
            //return res.status(400).json({ email: "This employee ID is associated with an existing account." });
        }
        else {
            User.findOne({ email }).then(user => {
                if (user){
                    errors.message = "This employee ID is associated with an existing account.";
                    res.render('login', { error: errors });
                    //return res.status(400).json({ email: "This email address is associated with an existing account." });
                }
                else {
                    // obtain user avatar
                    const avatar = gravatar.url(req.body.email, {
                        s: "200", // size
                        r: "pg", // Rating
                        d: "mm" // Default
                    });

                    // create User object
                    const newUser = new User({
                        employeeId: req.body.employeeId,
                        fullName: req.body.fullName,
                        password: req.body.password,
                        email: req.body.email,
                        // avatar
                    });

                    // encrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                        });
                    });
                    return res.redirect('/main');
                }
            })
        }
    });
});

router.post("/history/:user_id", (req, res) => {

    User.findOne({ _id: req.params.user_id })
        .then(user => {
            res.json(user)
        })
        .catch(err => res.status(404).json({ usernotfound: "User not found" }));
});

module.exports = router;
