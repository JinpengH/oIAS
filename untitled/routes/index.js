const express = require('express');
const router = express.Router();
const login_controller = require("../controllers/loginController");

// Load Model
const User = require(".." + "/server/models/User");
const Submission = require(".." + "/server/models/Submission");
const errors = {message:"",};
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
        //console.log(d.getDay());
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 4);
        let monday = new Date(d.setDate(diff));
        //console.log(monday.getDay());
        Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
            let number = 0;
            for (let i = 0; i < list.length; i++) {
                if(list[i].dateTime.getDay() === monday.getDay()){
                    console.log(list[i].dateTime.getDay());
                    number+=1;
                }
            }
            //console.log(number);

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
        for (let i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === tuesday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
        number = 0;
        for (let i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === wednesday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
        number = 0;
        for (let i = 0; i < list.length; i++) {
            if(list[i].dateTime.getDay() === thursday.getDay()){
                number+=1;
            }
        }
        listOfTimes.push(number);
        number = 0;
        for (let i = 0; i < list.length; i++) {
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
    console.log(listOfTimes);
    res.send(listOfTimes);
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
        let id = req.session.loginUserId;
        let query = {employeeId:id};
        console.log(id);
        User.find(query).then(user =>{
            console.log(user);
        });
        res.render('login');

    }

});
module.exports = router;
