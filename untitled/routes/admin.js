const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const errors = {message: "",};

// Load User Model
const User = require("../server/models/User");
// const Admin = require(".." + "/server/models/Admin");

// Load Submission Model
const Submission = require("../server/models/Submission");
const ValidateSubmissionFields = require("../server/validation/post.validation.js");
const validatePostInput = require("../server/validation/post.validation.js");

// Fix favicon 500 error
router.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Checking if there is a valid logged in user
const checkLoggedIn = function (req, res, next) {
    console.log("Checking if there is a valid logged in user");
    if (!req.session) {
        alert("Your session has expired. Please login to continue.");
        res.redirect('/admin');
    }
    next();
};

// Checking if there is a valid admin user"
const checkAdmin = function (req, res, next) {
    console.log("Checking if there is a valid admin user");
    if (req.session.loginUserGroup !== 0) {
        alert("You don't have permissions. Please contact your admin.");
        req.session.destroy();
        res.redirect('/admin');
    }
    next();
};

// Set up transporter for resetting email
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465, // SMTP
    secureConnection: true,
    auth: {
        user: 'oics2019@gmail.com',
        pass: 'oics@1234'
    }
});

// Go to admin login page
router.get('/admin', function(req, res) {
    if (!req.session) {
        return res.render("admin");
    }
    else if (req.session.loginUserGroup !== 0) {
        req.session.destroy();
        return res.render("admin");
    }
    res.redirect('/admin/overview');
});

// Admin login
// request parameter: username, password

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username }).then(user => {
        // check admin
        if (!user) {
            errors.message = "Username/Password combination incorrect, please check again";
            return res.render('admin', { error: errors });
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                req.session.loginUser = user;
                req.session.loginUserId = user.id;
                req.session.loginUserGroup = user.userGroup;
                req.user = user;
                console.log("admin login successful");
                res.redirect('/admin/overview');
            }
            else {
                errors.message = "Username/Password combination incorrect, please check again";
                return res.render('admin', { error: errors });
            }
        });
    });
});

// Go to admin overview page
router.get("/overview", [checkLoggedIn, checkAdmin], (req, res) => {
    console.log("In admin overview");
    User.find().then(list => {
        return res.render('overview', {title: 'Admin Overview', list: list});
    });
});

// =======
// const admin_controller = require("../controllers/adminController");
// //Admin login
// router.get('/', admin_controller.login);
// router.post("/login", admin_controller.login);

// // Add an employee with employeeId and departmentId
// router.post("/add-employee", admin_controller.add);
// >>>>>>> master

// Add an employee into the database and send an activation email
// request parameters: employeeId, fullName, userGroup, departmentId
router.post("/add-employee", [checkLoggedIn, checkAdmin], (req, res, next) => {
    const employeeId = req.body.employeeId;
    User.findOne({ employeeId }).then(user => {
        if (user) {
            alert("This employee ID already exists. No need to add it again.");
        }
        else {
            const newUser = new User({
                employeeId: req.body.employeeId,
                fullName: req.body.fullName,
                userGroup: req.body.userGroup,
                departmentId: req.body.departmentId,
                email: req.body.email
            });
            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            next();
            User.find().then(list => {
                return res.render('overview', {list: list});
            });
        }
    })
}, function(req, res) {
    const email = req.body.email;
    const fullName = req.body.fullName;
    const employeeId = req.body.employeeId;
    let mailOptions = {
        from: '"ObEN Invoice Management System" <oics2019@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "[ACTION REQUIRED] Activate your ObEN Invoice Management System account", // Subject line
        html: "Hello " + fullName + ",<br><br>To activate your ObEN Invoice Management System account, please click the following link.<br><br>" +
            "(http://localhost:3000/activation" + ":" + employeeId + ")"  + "<br>" +
            "<br><br>"+
            "Thank you,<br>" +
            "ObEN, Inc.<br>" // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
    });
    return res.send({
        message: 'Activation email was successfully sent'
    });
});

module.exports = router;
