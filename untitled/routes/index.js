var express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../server/config/keys");
const passport = require("passport");
const gravatar = require("gravatar");
const http = require('http');

const router = express.Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const commentSchema = mongoose.Schema({}, { _id: false });
mongoose.connect("mongodb+srv://oics2019:oics2019@cluster0-4fxam.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
let db = mongoose.connection;

// Load Input Validation
const validateRegisterInput = require("../server/validation/register.validation.js");
const validateLoginInput = require("../server/validation/login.validation.js");

// Load User Model
const User = require(".." +
    "/server/models/User");
const Submission = require(".." + "/server/models/Submission");
//var mongo = require('mangodb');
const errors = {message:"",
   };

//fixed favicon
router.get('/favicon.ico', (req, res) => res.sendStatus(204));
/* GET home page. */
router.get('/login', function(req, res, next) {
    if(req.session.loginUser){
        res.render('main', {title: 'main', user: req.session.loginUser});
    }
    res.render('login', { error: errors });
});

router.get('/', function(req, res, next) {
    res.render('login', { error: errors });
});
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
        const submissions = Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
            return res.render('statistic', {list: list});
        });

    }
});
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'profile' });
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
router.post("/login", loginPost, mainGet);



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



router.get('/logout', Logout);

function Logout(req,res){
    req.session.destroy();
    res.redirect('/login');
}

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465, // SMTP
    secureConnection: true,
    auth: {
        user: 'oics2019@gmail.com',
        pass: 'oics@1234'
    }
});
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
                  html: "<br>Hi oBen user,<br> You recently requested to reset your password for invoice control system, Click the link below to reset.<br>" +
                      "(http://localhost:3000/request" + ":" + email + ")"  + "<br>" +
                      "It you did not request a password reset, please ignore this email or reply to (obEN@gmail.com) to let us know.<br>" +
                      "<br><br><br>"+
                      "Thanks<br>" +
                      "oBen Financial team<br>" // html body
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

module.exports = router;
