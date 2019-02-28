const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const errors = {message:"",};

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

// Admin login
router.post("/login-admin", (req, res) => {
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
            return res.render('adminlogin',{error: errors}); // TODO adminlogin: login page only for admin
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                req.session.loginUser = user;
                req.session.loginUserId = user.id;
                req.session.loginUserGroup = user.userGroup;
                req.user = user;
                return res.render('controlpanel', {user: user}); // TODO controlpanel: landing page only for admin\
            }
            else {
                errors.message = "Username/Password combination incorrect, please check again";
                return res.render('login',{error: errors});
                // return res.status(400).json(errors);
            }
        });
    });
}

// Add an employee with employeeId and departmentId
router.post("/add-employee", (req, res) => {
    if (req.session.loginUserId == null) {
        alert("Your session has expired. Please login to continue.");
        return res.render('adminlogin', {error: errors});
    }
    const id = req.session.loginUserId;
    const userGroup = req.session.loginUserGroup;
    User.findOne({_id: id})
        .then(user => {
            if (userGroup == 0) {
                const employeeId = req.body.employeeId;
                User.findOne({employeeId}).then(user => {
                    if (user) {
                        errors.message = "This employee ID already exists. No need to add it again.";
                        // res.render('login', { error: errors });
                    } else {
                        const newUser = new User({
                            employeeId: req.body.employeeId,
                            fullName: req.body.fullName,
                            userGroup: req.body.userGroup,
                            departmentId: req.body.departmentId
                        });
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    }
                })
            }
            else {
                errors.message = "You don't have permissions. Please contact your admin.";
                res.render('login', { error: errors });
            }

        })
        .catch(err => res.status(404).json({usernotfound: "User not found."}));
}


module.exports = router;
