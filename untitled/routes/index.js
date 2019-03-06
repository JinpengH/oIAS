
const moment = require("moment");
const callback = require("callback");
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const constDepartment = require('../const/ConstDepartment');
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
        Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
            list.forEach(function(element){
                element.date = moment(element.dateTime).format('MM/DD/YYYY');
            });
            return res.render('statistic', {title: 'stat', list: list});
        });
    }
});

router.get('/getChartData/:n',function(req,res){
    let days = req.params.n;
    let data = [];
    let listOfTimes = [];
    let dispense = 0;
    let i = 1;
    let d = new Date();
    let before = new Date();
    function asyncLoop(i, date, cb){
        if(i <= days){
            before = new Date(d.getTime()- (24 * 60 * 60 * 1000));
            Submission.find({linkedUserId: req.session.loginUserId, dateTime: {$gte:before, $lte:d}}).then(list => {
                listOfTimes.push(list.length);
                for(let j=0; j<list.length; j++){
                    dispense += list[j].dispense;
                }
                asyncLoop(i+1,cb);
            });
            d = before;
        }else{
            listOfTimes = listOfTimes.reverse();
            data.push(listOfTimes);
            data.push(dispense);
            res.send(data);
        }
    }
    asyncLoop(i,function(){
        callback({'lists':listOfTimes, 'dispense': dispense});
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
        let query = {id_:id};
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) throw err;
                newPassword = hash;
                console.log("new word hash is  " + hash);
                User.findOneAndUpdate(
                    query,
                    { $set: { password: newPassword } },
                    { new: true, useFindAndModify: false }
                ).then(user =>{
                    console.log(user);
                });
            });
        });

        res.redirect('/login');

    }
});

router.get("/getList", function(req,res){
    let userGroup = req.session.loginUserGroup;
    let myList = [];
    //TODO add userGroup 3 and 4;
    switch(userGroup){
        case 1:
            myList.push([req.session.loginUserId,"me"]);
            res.send(myList);
            break;
        case 2:
            myList.push([req.session.loginUserId,"me"]);
            myList.push(["","------User------"]);
            User.find({departmentId: req.session.departmentId}).then(list=>{
                list.forEach(function(element){
                    myList.push([element.id_,element.fullName]);
                });
                myList.push(['','-----Department-----']);
                myList.push([req.session.departmentId,constDepartment.get(1)]);
                res.send(myList);
            });
            break;
        default:
            myList.push([req.session.loginUserId,"me"]);
            res.send(myList);
            break;
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

module.exports = router;
