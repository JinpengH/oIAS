const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../server/config/keys");
const passport = require("passport");
const gravatar = require("gravatar");
const http = require('http');
const router = express.Router();
const nodemailer = require("nodemailer");

// Load Input Validation
const validateRegisterInput = require("../server/validation/register.validation.js");
const validateLoginInput = require("../server/validation/login.validation.js");

// Load User Model
const User = require(".." + "/server/models/User");
const Submission = require(".." + "/server/models/Submission");
const errors = {message:"",};
//fixed favicon
router.get('/favicon.ico', (req, res) => res.sendStatus(204));

/* GET home page. */
router.get('/login', function(req, res, next) {
    if(req.session.loginUser){
        res.render('main', {title: 'Main', user: req.session.loginUser});
    }
    res.render('login', { error: errors });
});

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


// Logout current user and go to login page
router.get('/logout', Logout);
function Logout(req,res){
    req.session.destroy();
    res.redirect('/login');
}


// Login an existing user
router.post("/login", loginPost, mainGet);

router.get('/main',mainGet);

function mainGet(req,res){
    //const name = req.name;
    //const user = req.user;
    //res.render('main', { title: 'main', name, user});
    const sess = req.session;
    user = sess.loginUser;
    if(typeof user === 'undefined'){
        const errors = {message: ""};
        res.render('login',{error:errors});
    }
    else {
        const submissions = Submission.find({linkedUserId: sess.loginUserId}).then(list =>{
            return res.render('main',{list:list});
        });
    }
}

/*
router.get('/main',function(req, res, next){
    res.render('main', { title: 'main'});
});*/
router.get('/main',mainGet);

router.get('/statistic', function(req, res, next) {
    let user = req.session.loginUser;
    if(typeof user === 'undefined'){
        const errors = {message: ""};
        res.render('login',{error:errors});
    }
    else {
        var time;
        let d = new Date();
        console.log(d.getDay());
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 4);
        let monday = new Date(d.setDate(diff));
        console.log(monday.getDay());
        Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
            let number = 0;
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDay() === monday.getDay()){
                    console.log(list[i].dateTime.getDay());
                    number+=1;
                }
            }
            console.log(number);
            return res.render('statistic', {title: 'stat', list: list});
        });
    }
});
router.get('/weekly',function(req,res){
    //Monday
    var listOfTimes = [];
    var d = new Date();
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1);
    var monday = new Date(d.setDate(diff));
    diff = d.getDate() - day + (day === 0 ? -6 : 2);
    var tuesday = new Date(d.setDate(diff));
    diff = d.getDate() - day + (day === 0 ? -6 : 3);
    var wednesday = new Date(d.setDate(diff));
    diff = d.getDate() - day + (day === 0 ? -6 : 4);
    var thursday = new Date(d.setDate(diff));
    diff = d.getDate() - day + (day === 0 ? -6 : 5);
    var friday = new Date(d.setDate(diff));
    Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
        var number = 0;
        for (var i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === monday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
        number = 0;
        for (var i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === tuesday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
        number = 0;
        for (var i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === wednesday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
        number = 0;
        for (var i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === thursday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
        number = 0;
        for (var i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === friday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
    });

    /*
    var monday = new Date(d.setDate(diff));
    Submission.find({linkedUserId: req.session.loginUserId, dateTime: monday}).then(list=>{
        listOfTimes.push(list.length);
    });

    //Tuesday
    diff = d.getDate() - day + (day == 0 ? -5 : 1);
    var tuesday = new Date(d.setDate(diff));
    Submission.find({linkedUserId: req.session.loginUserId, dateTime: tuesday}).then(list=>{
        listOfTimes.push(list.length);
    });

    //Wednesday
    diff = d.getDate() - day + (day == 0 ? -4 : 1);
    var wednesday = new Date(d.setDate(diff));
    Submission.find({linkedUserId: req.session.loginUserId, dateTime: wednesday}).then(list=>{
        listOfTimes.push(list.length);
    });

    //Thursday
    diff = d.getDate() - day + (day == 0 ? -3 : 1);
    var thursday = new Date(d.setDate(diff));
    Submission.find({linkedUserId: req.session.loginUserId, dateTime: thursday}).then(list=>{
        listOfTimes.push(list.length);
    });

    //Friday
    diff = d.getDate() - day + (day == 0 ? -2 : 1);
    var friday = new Date(d.setDate(diff));
    Submission.find({linkedUserId: req.session.loginUserId, dateTime: friday}).then(list=>{
        listOfTimes.push(list.length);
    });
    */
    res.json(listOfTimes);
});
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Profile' });
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
                req.session.loginUserGroup = user.userGroup;
                req.user = user;
                //mainGet();
                //TODO has to be refreshed once to display
                return res.render('main', {list: []});

            } else {
                errors.message = "Email/Password combination incorrect, please check again";
                return res.render('login',{error: errors});
                //return res.status(400).json(errors);
            }
        });
    });
}

// Register a new user
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

// Reset password by email
router.post('/reset', function(req, res, next) {
    const email = req.body.email;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))
    {
        User.findOne({ email }).then(user => {
          if(user) {
              let mailOptions = {
                  from: '"OIAS" <oics2019@gmail.com>', // sender address
                  to: email, // list of receivers
                  subject: "Notice from OIAS", // Subject line
                  html: "<br>Hi ObEN Invoice Management System user,<br>To rest your password, please click the following link.<br>" +
                      "(http://localhost:3000/changePassword" + ":" + email + ")"  + "<br>" +
                      "It you did not request a password reset, please disregard this email.<br>" +
                      "<br><br><br>"+
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
        let id = req.session.loginUserId;
        let query = {employeeId:id};
        console.log(id);
        User.find(query).then(user =>{
            console.log(user);
        });
        res.render('login');

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
