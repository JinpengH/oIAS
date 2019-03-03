const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const errors = {message:"",};

// Load User Model
const User = require("../server/models/User");
// const Admin = require(".." + "/server/models/Admin");

// Load Submission Model
const Submission = require("../server/models/Submission");
const ValidateSubmissionFields = require("../server/validation/post.validation.js");

const validatePostInput = require("../server/validation/post.validation.js");

var checkLoggedIn = function (req, res, next) {
    console.log("Checking if there is a valid logged in user");
    if (!req.session) {
        alert("Your session has expired. Please login to continue.");
        res.redirect('/admin');
    }
    next();
};

var checkAdmin = function (req, res, next) {
    console.log("Checking if there is a valid admin user");
    if (req.session.loginUserGroup !== 0) {
        alert("You don't have permissions. Please contact your admin.");
        req.session.destroy();
        res.redirect('/admin');
    }
    next();
};

router.get('/admin', function(req, res) {
    if (!req.session) {
        return res.render("admin");
    }
    else if (req.session.loginUserGroup !== 0) {
        req.session.destroy();
        return res.render("admin");
    }
    return res.render("admin");
});

// Fix favicon 500 error
router.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Admin login
// request parameter: username, password
router.post("/login", (req, res) => {
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
            res.redirect("/admin");
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                req.session.loginUser = user;
                req.session.loginUserId = user.id;
                req.session.loginUserGroup = user.userGroup;
                req.user = user;
                console.log("admin login successful");
                console.log(req.user);
                console.log(req.session);
                res.redirect('/admin/overview');
            }
            else {
                errors.message = "Username/Password combination incorrect, please check again";
                return res.render('admin',{ title: 'Admin Login', error: errors });
            }
        });
    });
});

// Add an employee into the database
// request parameters: employeeId, fullName, userGroup, departmentId
router.post("/add-employee", (req, res) => {
    if (req.session.loginUserId == null) {
        alert("Your session has expired. Please login to continue.");
        return res.render('admin', { title: 'Admin Login', error: errors });
    }
    const id = req.session.loginUserId;
    const userGroup = req.session.loginUserGroup;
    User.findOne({_id: id})
        .then(user => {
            if (userGroup === 0) {
                const employeeId = req.body.employeeId;
                User.findOne({employeeId}).then(user => {
                    if (user) {
                        alert("This employee ID already exists. No need to add it again.");
                    }
                    else {
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
                        User.find().then(list => {
                            return res.render('overview', {title: 'Admin Overview', list: list});
                        });
                    }
                })
            }
            else {
                alert("You don't have permissions. Please contact your admin.");
                res.redirect("/admin");
            }

        })
        .catch(err => res.status(404).json({usernotfound: "User not found."}));
});

router.get("/overview", [checkLoggedIn, checkAdmin], (req, res) => {
    console.log("In admin overview");
    User.find().then(list => {
        return res.render('overview', {title: 'Admin Overview', list: list});
    });
});



module.exports = router;
