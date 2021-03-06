const errors = {message:"",};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../server/config/keys");
const validateRegisterInput = require("../server/validation/register.validation.js");
const nodemailer = require("nodemailer");
const main_controller = require("../controllers/mainController");
const Submission = require("../server/models/Submission");
const User = require("../server/models/User");

exports.index = function(req,res){
    if(req.session.loginUser){
        res.redirect('/main');
    }
    else {
        console.log("here")
        res.render('login',{error:errors});
    }

};


exports.logout =  function(req,res){
    req.session.destroy();
    return res.render('login');
};



exports.login = function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        // check for user
        if (!user) {
            errors.message = "Email/Password combination incorrect, please check again.";
            return res.render('login',{error: errors});
        }

        else if (!user.active) {
            errors.message = "Your account has not been activated yet.";
            return res.render('login',{error: errors});
        }
        else {
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
                        {expiresIn: 3600},
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                    //save user to session
                    req.session.loginUser = user;
                    req.session.loginUserName = user.fullName;
                    req.session.loginUserEmail= user.email;
                    req.session.loginUserId = user.id;
                    req.session.loginUserGroup = user.userGroup;
                    req.session.departmentId = user.departmentId;
                    req.user = user;
                    return res.redirect('/welcome');


                } else {
                    errors.message = "Email/Password combination incorrect, please check again";
                    return res.render('login', {error: errors});
                    //return res.status(400).json(errors);
                }
            });
        }

    });
};
function mainGet(req,res){
    Submission.find({linkedUserId: req.session.loginUserId}).then(list =>{
        return list;
    });
};

exports.sendPassword = function(req, res) {
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
    const email = req.body.email;
    // const employeeId = req.body.employeeId;
    // const password = req.body.password;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))
    {
        User.findOne({ email }).then(user => {
            if(user) {
                // let password = user.password;
                let email = user.email;
                let _id = user._id;
                // console.log(email);
                let mailOptions = {
                    from: '"OIAS" <oics2019@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Notice from OIAS", // Subject line
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

};

