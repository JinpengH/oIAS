var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../public/server/config/keys");
const passport = require("passport");
const gravatar = require("gravatar");
const http = require('http');

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
    if(req.session.loginUser){
        res.render('main', {title: 'main', user: req.session.loginUser});
    }
    res.render('login', { error: errors });
});

router.get('/', function(req, res, next) {
    res.render('login', { error: errors });
});
function mainGet(req,res){
    //const name = req.name;
    //const user = req.user;
    //res.render('main', { title: 'main', name, user});
    const sess = req.session;
    user = sess.loginUser;
    return res.render('main', { title: 'main', user: user});
}
/*
router.get('/main',function(req, res, next){
    res.render('main', { title: 'main'});
});*/
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
                req.session.loginUser = user;
                req.session.loginUserId = user.id;
                req.user = user;
                return res.render('main', {user: user});

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
        res.render('login', { error: errors });
        //return res.status(400).json(errors);
    }

    const employeeId = req.body.employeeId;
    const email = req.body.email;

    User.findOne({ employeeId }).then(user => {
        if (user) {
            errors.message = "This employee ID is associated with an existing account.";
            res.render('login', { error: errors });
            //return res.status(400).json({ email: "This employee ID is associated with an existing account." });
        }
        else {
            User.findOne({ email }).then(user1 => {
                if (user1){
                    errors.message = "This email is associated with an existing account.";
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
                    return res.render('login', {error: errors});
                }
            })
        }
    });
    User.findOne({ employeeId }).then(user2 => {
        if(user2){
            // req.session.loginUser = user2;
            // req.session.loginUserId = user2.id;
            // res.render("main",{user: user2});
            console.log("hey");
        }
    })
});

router.post("/history/:user_id", (req, res) => {

    User.findOne({ _id: req.params.user_id })
        .then(user => {
            res.json(user)
        })
        .catch(err => res.status(404).json({ usernotfound: "User not found" }));
});

router.post('/ajax',function(req,res){
    res.send("hey");
})

/*
router.get('/go',directMain);

function directMain(req,res){
    const sess = req.session;
    user = sess.loginUser;
    return res.render('main', {user: user});
}*/

router.get('/logout', Logout);

function Logout(req,res){
    req.session.destroy();
    res.redirect('/login');
}

module.exports = router;
