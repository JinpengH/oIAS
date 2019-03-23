
const moment = require("moment");
const callback = require("callback");
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const fs = require('fs');
const pdf = require('html-pdf');

const options = { format: 'Letter' };

mongoose.set('useFindAndModify', false);
// Load User Model
const login_controller = require("../controllers/loginController");
const main_controller = require("../controllers/mainController");
const statistic_controller = require("../controllers/statisticController");

// Load Model
const User = require(".." + "/server/models/User");
const Submission = require(".." + "/server/models/Submission");
//fixed favicon
router.get('/favicon.ico', (req, res) => res.sendStatus(204));

/* GET home page. */
router.get('/', login_controller.index);
router.get('/login', login_controller.index);
// Register a new user
router.post("/register", login_controller.register);
// Reset password by email
router.post('/reset', login_controller.sendPassword);
// Logout current user and go to login page
router.get('/logout', login_controller.logout);
// Login an existing user
router.post("/login", login_controller.login);


// Go to admin login page
router.get('/admin', function (req, res) {
    res.render('admin', {title: 'Admin Login'});
});

// Get Profile
router.get('/profile', function(req, res, next) {
    let user = req.session.loginUser;
    if(typeof user === 'undefined'){
        const errors = {message: ""};
        res.render('login',{error:errors});
    }
    let position = "Admin";
    let department = "Finanace";
    switch(user.userGroup){
        case 1:
            position = "Employee";
            break;
        case 2:
            position = "Team Manager";
            break;
        case 3:
            position = "CFO";
            break;

    }
    switch(user.departmentId){
        case 1:
            department = "Finance";
            break;
        case 2:
            department = "Machine Learning";
            break;
        case 3:
            department = "AI";
            break;

    }
    res.render('profile', { title: 'Profile',user:user,position:position,department:department});
});

router.get('/main',main_controller.index);

router.get('/statistic', statistic_controller.index);

router.get('/getChartData/:n',statistic_controller.getChartData);

router.get("/getList", statistic_controller.getList);

router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Profile' });
});
router.get('/resetPassword',function(req,res,next){
    res.render('resetPassword');
});
router.get("/download",statistic_controller.download);
router.post('/changePassword',function(req,res,next){
    let originalPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if(originalPassword === newPassword){
        res.render('resetPassword',{error:{message:"password can't be the same!"}})
    }
    else{
        let id = req.session.loginUserId;
        console.log('id', id);
        let query = {
            _id:id
        };
        console.log('new',newPassword)
        User.findOne(
            query
        ).then(user =>{
            console.log('user',user);
            bcrypt.genSalt(10, (err, salt) => {
                console.log('salt', salt)
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
            console.log(user);
            res.render('login');
        });


    }

});



router.get("/activation", (req, res) => {
    const employeeId = req.query.employeeId;

    User.findOne({ employeeId }).then(user => {
        if (user) {
            const fullName = user.fullName;
            const userGroup = user.userGroup;
            const departmentId = user.departmentId;

            return res.render('activation', { employeeId: employeeId, fullName: fullName, userGroup: userGroup, departmentId: departmentId });
        }
        else {
            alert("This employee ID does not exist in the system.");
            res.redirect("/login");
        }
    });
});

router.post("/activate", (req, res) => {
    const employeeId = req.body.employeeId;
    const email = req.body.email;

    User.findOne({ employeeId }).then(user => {
        if (user) {
            User.findOne({ email }).then(user1 => {
                if (user1){
                    errors.message = "This email is associated with an existing account.";
                    res.render('login', { error: errors });
                }
                else {
                    // encrypt password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            }
                            User.findOneAndUpdate(employeeId, { email: email, password: hash });
                        });
                    });
                    res.redirect("/login");
                }
            })
        }
        else {
            errors.message = "This employee ID does not exist in the system.";
            res.render('/activation', { error: errors });
        }
    });
});

router.get("/myname", (req,res)=>{
    console.log(req.session.loginUserName);
    res.send(req.session.loginUserName);
});

module.exports = router;
