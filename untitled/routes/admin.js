const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Load User Model
const User = require("../server/models/User");

// Load Submission Model
const Submission = require("../server/models/Submission");
const ValidateSubmissionFields = require("../server/validation/post.validation.js");

// Fix favicon 500 error
router.get('/admin', function(req, res, next) {
    if(req.session.loginUser){
        res.render('main', {title: 'main', user: req.session.loginUser});
    }
    res.render('admin', { error: errors });
});

router.post("/login-admin", AdminLogin);
const errors = {message:"",};

function AdminLogin(req,res){
    // TODO check empty fields
    /*const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.render('login',{error: errors});
        //return res.status(400).json(errors);
    }
    */

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username }).then(user => {
        // check admin
        if (!user) {
            errors.message = "Username/Password combination incorrect, please check again";
            return res.render('login-admin',{error: errors}); // TODO login-admin: login page only for admin
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                req.session.loginUser = user;
                req.session.loginUserId = user.id;
                req.user = user;
                return res.render('control-panel', {user: user}); // TODO control-panel: landing page only for admin\
            }
            else {
                errors.message = "Username/Password combination incorrect, please check again";
                return res.render('login',{error: errors});
                //return res.status(400).json(errors);
            }
        });
    });
}

module.exports = router;
