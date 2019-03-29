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
    if (!req.session) {
        alert("Your session has expired. Please login to continue.");
        res.redirect('/admin');
    }
    next();
};

// Checking if there is a valid admin user"
const checkAdmin = function (req, res, next) {
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
    res.redirect('/admin/employees');
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
                res.redirect('/admin/employees');
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
    User.find({userGroup: {$ne: 0}}).then(list => {
        console.log(list[3].fullName + " " + list[3].departmentId);
        return res.render('overview', {title: 'Admin Overview', list: list});
    });
});
// Go to admin employees pa
router.get("/employees", [checkLoggedIn, checkAdmin], (req, res) => {
    User.find({ userGroup: { $ne: 0 }}).then(list => {
        // console.log(list[3].fullName + " " + list[3].departmentId);
        return res.render('employees', {list: list});

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
        //TODO send an error message here;
        if (user) {
            alert("This employee ID already exists. No need to add it again.");
        }
        else {
            const newUser = new User({
                employeeId: req.body.employeeId,
                active: false,
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
                return res.render('employees', {list: list});
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
            "http://localhost:3000/activation?employeeId=" + employeeId + "<br>" +
            "<br><br>"+
            "Thank you,<br>" +
            "ObEN, Inc.<br>" // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
    return res.send({
        message: 'Activation email was successfully sent'
    });
});

router.post("/assign-user/:email/:team/:type", [checkLoggedIn, checkAdmin], (req, res) => {
    let email = req.params.email;
    let team = req.params.team;
    let type = req.params.type;

    if(type === "3"){
        User.find().then(list =>{
            for(let i=0; i<list.length; i++) {
                if(list[i].email !== email && list[i].userGroup === 3){
                    console.log(type);
                    console.log("cannot have two VPs at the same time");
                    return res.send({err: "Cannot have two VPs at the same time!"});
                }
            }
            User.findOneAndUpdate(
                { email: email },
                {$set: {departmentId: team, userGroup: type}},
                (err) => {
                    if(err){
                        console.log("something wrong happened");
                    }else{
                        User.find().then(list => {
                            return res.send(list);
                        });
                    }
                });
        });
    }else{
        User.findOneAndUpdate(
            { email: email },
            {$set: {departmentId: team, userGroup: type}},
            (err) => {
                if(err){
                    console.log("something wrong happened");
                }else{
                    User.find().then(list => {
                        return res.send(list);
                    });
                }
            });
    }
});

router.get("/submissions", [checkLoggedIn, checkAdmin], (req, res) => {
    Submission.find().then(list => {
        return res.render('submissions', {list: list});
    });
});

router.get("/logout", (req, res) =>  {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
