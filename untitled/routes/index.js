const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
// Load User Model
const login_controller = require("../controllers/loginController");
const main_controller = require("../controllers/mainController");

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

router.get('/statistic', function(req, res, next) {
    let user = req.session.loginUser;
    if(typeof user === 'undefined'){
        const errors = {message: ""};
        res.redirect('/login');
    }
    else {
        let d = new Date();
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1);
        let monday = new Date(d.setDate(diff));
        Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
            return res.render('statistic', {title: 'stat', list: list});
        });
    }
});
router.get('/weekly',function(req,res){
    let listOfTimes = [];
    let d = new Date();
    let day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1);
    let monday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 2);
    let tuesday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 3);
    let wednesday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 4);
    let thursday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 5);
    let friday = new Date(d.setDate(diff));
    d = new Date();
    Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
        let number = 0;
        if(d.getDay() >= monday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === monday.getDate() &&
                    list[i].dateTime.getMonth() === monday.getMonth() &&
                    list[i].dateTime.getFullYear() === monday.getFullYear()){
                    number+=1;
                }
            }
        }
        listOfTimes.push(number);
        number = 0;
        if(d.getDay() >= tuesday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === tuesday.getDate() &&
                    list[i].dateTime.getMonth() === tuesday.getMonth() &&
                    list[i].dateTime.getFullYear() === tuesday.getFullYear()){
                    number+=1;
                }
            }
        }
        listOfTimes.push(number);
        number = 0;
        if(d.getDay() >= wednesday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === wednesday.getDate() &&
                    list[i].dateTime.getMonth() === wednesday.getMonth() &&
                    list[i].dateTime.getFullYear() === wednesday.getFullYear()){
                    number+=1;
                }
            }
        }
        listOfTimes.push(number);
        number = 0;
        if(d.getDay() >= thursday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === thursday.getDate() &&
                    list[i].dateTime.getMonth() === thursday.getMonth() &&
                    list[i].dateTime.getFullYear() === thursday.getFullYear()){
                    number+=1;
                }
            }
        }
        listOfTimes.push(number);
        number = 0;
        if(d.getDay() >= friday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === friday.getDate() &&
                    list[i].dateTime.getMonth() === friday.getMonth() &&
                    list[i].dateTime.getFullYear() === friday.getFullYear()){
                    number+=1;
                }
            }
        }
        listOfTimes.push(number);
        res.send(listOfTimes);
    });
});

router.get('/dispense',function(req,res){
    let dispense = 0;
    let d = new Date();
    let day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1);
    let monday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 2);
    let tuesday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 3);
    let wednesday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 4);
    let thursday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 5);
    let friday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 6);
    let saturday = new Date(d.setDate(diff));
    d = new Date();
    diff = d.getDate() - day + (day === 0 ? -6 : 7);
    let sunday = new Date(d.setDate(diff));
    d = new Date();
    Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
        if(d.getDay() >= monday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === monday.getDate() &&
                    list[i].dateTime.getMonth() === monday.getMonth() &&
                    list[i].dateTime.getFullYear() === monday.getFullYear()){
                    dispense += list[i].dispense;
                }
            }
        }
        if(d.getDay() >= tuesday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === tuesday.getDate() &&
                    list[i].dateTime.getMonth() === tuesday.getMonth() &&
                    list[i].dateTime.getFullYear() === tuesday.getFullYear()){
                    dispense += list[i].dispense;
                }
            }
        }
        if(d.getDay() >= wednesday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === wednesday.getDate() &&
                    list[i].dateTime.getMonth() === wednesday.getMonth() &&
                    list[i].dateTime.getFullYear() === wednesday.getFullYear()){
                    dispense += list[i].dispense;
                }
            }
        }
        if(d.getDay() >= thursday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === thursday.getDate() &&
                    list[i].dateTime.getMonth() === thursday.getMonth() &&
                    list[i].dateTime.getFullYear() === thursday.getFullYear()){
                    dispense += list[i].dispense;
                }
            }
        }
        if(d.getDay() >= friday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDate() === friday.getDate() &&
                    list[i].dateTime.getMonth() === friday.getMonth() &&
                    list[i].dateTime.getFullYear() === friday.getFullYear()){
                    dispense += list[i].dispense;
                }
            }
        }
        if(d.getDay() >= saturday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDay() === saturday.getDay() &&
                    list[i].dateTime.getMonth() === saturday.getMonth() &&
                    list[i].dateTime.getFullYear() === saturday.getFullYear()){
                    dispense += list[i].dispense;
                }
            }
        }
        if(d.getDay() >= sunday.getDay()){
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDay() === sunday.getDay() &&
                    list[i].dateTime.getMonth() === sunday.getMonth() &&
                    list[i].dateTime.getFullYear() === sunday.getFullYear()){
                    dispense += list[i].dispense;
                }
            }
        }
        res.send(dispense);
    });
});

router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Profile' });
});
router.get('/resetPassword',function(req,res,next){
    res.render('resetPassword');
});

router.post('/changePassword',function(req,res,next){
    let originalPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    if(originalPassword === newPassword){
        res.render('resetPassword',{error:{message:"password can't be the same!"}})
    }
    else{
        //TODO changepassword notworking miao
        let id = req.session.loginUserId;
        let query = {id_:req.session.loginUserId};
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) throw err;
                newPassword = hash;
                User.findOneAndUpdate(
                    query,
                    { $set: { password: newPassword } },
                    { new: true, useFindAndModify: false }
                ).then(user =>{
                    res.json(user);
                });
            });
        });

        res.redirect('/login');

    }

});

router.get("/")

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

module.exports = router;
