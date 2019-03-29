Submission = require("../server/models/Submission");
User = require("../server/models/User");

exports.index = function(req,res){
    if(req.session.loginUser){
        res.render('employees');
    }
    res.render('admin');
};

exports.login = function(req,res){

    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username }).then(user => {
        // check admin
        if (!user) {
            errors.message = "Username/Password combination incorrect, please check again";
            return res.render('admin',{error: errors }); // TODO admin: login page only for admin
        }

        // Check Password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                req.session.loginUser = user;
                req.session.loginUserId = user.id;
                req.session.loginUserGroup = user.userGroup;
                req.user = user;
                User.find().then(list =>
                {
                    return res.render('employees', {user: user, list: list}); // TODO overview: landing page only for admin\
                });
            }
            else {
                errors.message = "Username/Password combination incorrect, please check again";
                return res.render('admin',{error: errors });
                // return res.status(400).json(errors);
            }
        });
    });
};

exports.add = function(req,res){
    if (req.session.loginUserId == null) {
        return res.render('admin', {error: errors });
    }
    const id = req.session.loginUserId;
    const userGroup = req.session.loginUserGroup;
    User.findOne({_id: id})
        .then(user => {
            if (userGroup === 0) {
                const employeeId = req.body.employeeId;
                User.findOne({employeeId}).then(user => {
                    if (user) {
                        errors.message = "This employee ID already exists. No need to add it again.";
                        // res.render('login', { error: errors });
                    }
                    else {
                        const newUser = new User({
                            employeeId: req.body.employeeId,
                            fullName: req.body.fullName,
                            userGroup: req.body.userGroup,
                            departmentId: req.body.departmentId
                        });
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    }
                })
            }
            else {
                errors.message = "You don't have permissions. Please contact your admin.";
                res.render('login', {error: errors });
            }

        })
        .catch(err => res.status(404).json({usernotfound: "User not found."}));
};