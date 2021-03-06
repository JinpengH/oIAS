const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multiparty = require("connect-multiparty")();
const errors = {message: "",};
const cloudinary = require("cloudinary");
const moment = require("moment");

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

router.get("/adminChangeEmail", function(req, res) {
    return res.render("adminChangeEmail", { email: req.session.loginUserEmail });
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
                req.session.loginUserEmail = user.email;
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

    })

}
    );
// Go to admin employees page

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
    const email = req.body.email;
    const fullName = req.body.fullName;
    User.findOne({ employeeId }).then(user => {
        if (user) {
            // todo
            // res.render('login', { error: errors });
            // alert("This employee ID already exists. No need to add it again.");
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
                // .then(user => res.json(user))
                .catch(err => console.log(err));

            // User.find().then(list => {
            //     return res.render('employees', {list: list});
            // });

            let mailOptions = {
                from: '"ObEN Invoice Management System" <oics2019@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "[ACTION REQUIRED] Activate your ObEN Invoice Management System account", // Subject line
                html: "Hello " + fullName + ",<br><br>To activate your ObEN Invoice Management System account, <br><br>" +
                    `<a href = 'http://localhost:3000/activation?employeeId=${employeeId}' style='color:dodgerblue'>please click here.</a>` +
                    // "http://localhost:3000/activation?employeeId=" + employeeId + "<br>" +
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
            return res.redirect('/admin/employees');
        }
    })
});

router.post("/assign-user/:email/:team/:type/:status", [checkLoggedIn, checkAdmin], (req, res) => {
    let email = req.params.email;
    let team = req.params.team;
    let type = req.params.type;
    let user_status = req.params.status;
    let status = false;
    if(user_status === '1'){status = true;
    console.log("passed");}
    console.log(status);



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
                { $set: {departmentId: team, userGroup: type, active: status} },
                (err) => {
                    if(err){
                        console.log("something wrong happened");
                    }
                    else{
                        User.find().then(list => {
                            return res.send(list);
                        });
                    }
                });
        });
    }
    else{
        User.findOneAndUpdate(
            { email: email },
            { $set: {departmentId: team, userGroup: type, active: status} },
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

router.post("/submission/approve/:id", [checkLoggedIn, checkAdmin], (req,res) => {
    let id = req.params.id;
    Submission.findOneAndUpdate({ _id : id }, { $set : { status:"Approved" } }).then(data => {
        res.send(data);
    });
});

router.post("/submission/decline/:id",[checkLoggedIn, checkAdmin], (req,res) => {
    let id = req.params.id;
    Submission.findOneAndUpdate({ _id : id }, { $set : { status:"Declined" } }).then(data => {
        res.send(data);
    });
});

router.post("/submission/create", multiparty, [checkLoggedIn, checkAdmin], (req, res, next) => {
    console.log("debug");
    console.log(req.body);
    const employeeId = req.body.employeeId;
    console.log("employeeid", employeeId);
    User.findOne({employeeId}).then(user => {
        if (!user) {
            console.log("cant found user id");
            errors.message = "There is no employee associated with this employee ID.";
            return res.redirect('/admin/submissions');
            // return res.render('admin/submission', { error: errors });
        } else {
            console.log("found user id");
            let fullName = user.fullName;
            let departmentId = user.departmentId;
            let linkedUserId = user._id;
            console.log(fullName);
            console.log(departmentId);

            const submissionFields = {};
            submissionFields.linkedUserId = linkedUserId;
            submissionFields.name = fullName;
            submissionFields.title = req.body.title;
            submissionFields.type_ = req.body.type;
            submissionFields.description = req.body.description;
            submissionFields.departmentId = departmentId;
            submissionFields.dispense = parseFloat(req.body.dispense);
            submissionFields.date = moment().format('MMM Do YY').toString();

            new Submission(submissionFields).save().then(submission => {
                // update User Model
                User.findOneAndUpdate(
                    { _id: submissionFields.linkedUserId },
                    { $push: { submissions: submission.id } },
                    { safe: true, upsert: true, new: true, useFindAndModify: false },
                    (err) => {
                        if (err) return res.status(400).json(err);
                        else {
                            return res.redirect('/admin/submissions');
                        }
                    }
                );
                // console.log(req);
                const filepath = req.files.file.path;

                // const employeeId = req.body.employeeId;
                // User.findOne({ employeeId }).then(user => {
                //     req = user;
                // });
                cloudinary.v2.uploader.upload(
                    filepath,
                    { public_id: submission.id },
                    function(error, result) {
                        // res.json(result);
                        //console.log(result, error);
                        let new_url = result.url;
                        Submission.findOneAndUpdate(
                            { _id: submission.id },
                            { $set: { file_url: new_url } },
                            // { $set: postFields },
                            { new: true, useFindAndModify: false }
                        ).then(submission => console.log(submission))
                        // .catch(err => res.status(400).json(err));
                    });
            });
        }
    });
});

router.get("/adminProfile", [checkLoggedIn, checkAdmin], (req, res) => {
    User.findOne({ username: "admin" }).then(user => {
        if (user) {
            req.session.loginUserEmail = user.email;
            res.render("adminProfile", { email: req.session.loginUserEmail });
        }
    });
});

router.get("/adminResetPassword", [checkLoggedIn, checkAdmin], (req, res) => {
    return res.render("adminResetPassword");
});

router.post('/changePassword',function(req,res,next){
    let originalPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if(originalPassword === newPassword){
        res.render('resetPassword',{error:{message:"password can't be the same!"}})
    }
    else{
        let id = req.session.loginUserId;

        let query = {
            _id:id
        };
        User.findOne(
            query
        ).then(user =>{
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user
                        .save()
                        .then(user => console.log(user))
                        .catch(err => console.log(err));
                });
            });
            console.log(user);
            res.redirect('/login');
        });
    }
});

router.post("/reset", function(req, res) {
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
    const username = req.body.username;
    // const employeeId = req.body.employeeId;
    // const password = req.body.password;
    if (username === "admin") {
        User.findOne({ username : "admin" }).then(user => {
            if(user) {
                // let password = user.password;
                let email = user.email;
                let _id = user._id;
                // console.log(email);
                let mailOptions = {
                    from: '"OIAS" <oics2019@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Reset Password", // Subject line
                    html: "<br>Hi ObEN Invoice Management System user,<br>To reset your password, <br>" +
                        // `<a href = 'http://localhost:3000/resetpassword2?email=${email}&password=${password}' style='color:dodgerblue'>please click here.</a>`+// html body
                        `<a href = 'http://96.30.195.0:3000/forgotPassword?_id=${_id}' style='color:dodgerblue'>please click here.</a>`+// html body
                        // "<a href = `http://96.30.195.0:3000/changePassword? + email >(" + ":" + email + ")"  + "<br>" +
                        "If you did not request a password reset, please disregard this email.<br>" +
                        "<br><br><br>"+
                        "Thank you,<br>" +
                        "ObEN, Inc.<br>" // html body
                };
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    //console.log("Message sent: %s", info.messageId);
                });

                return res.send({
                    message: 'Reset email is successfully sent'
                });

            }
            else{
                return res.send({
                    message: 'User not found'
                });
            }
        });
    }
    else {
        return res.send({
            message: 'This is an error!'
        });
    }

});

router.post('/changeEmail', [checkLoggedIn, checkAdmin], function(req,res){
    let newEmail = req.body.newEmail;
    let _id = req.session.loginUserId;
    User.findOneAndUpdate(
        { _id: _id },
        { $set: { email: newEmail} },
        (err) => {
            if(err){
                console.log("something wrong happened");
            }
        });
    // req.session.loginUserEmail = newEmail;
    return res.redirect('/admin/adminProfile');
});


module.exports = router;
