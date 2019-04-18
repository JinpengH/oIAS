Submission = require("../server/models/Submission");
User = require("../server/models/User");
const constDepartment = require('../const/ConstDepartment');
const bcrypt = require("bcryptjs");

exports.activation = function(req, res){
    const employeeId = req.query.employeeId;

    User.findOne({ employeeId }).then(user => {
        if (user) {
            const fullName = user.fullName;
            let userGroup = user.userGroup;
            let departmentId = user.departmentId;
            let userName = "";
            //console.log("Found user with employeeId " + employeeId);
            switch(userGroup){
                case 1:
                    userName = "Employee";
                    break;
                case 2:
                    userName = "Team Manager";
                    break;
                case 3:
                    userName = "VP";
                    break;
                case 4:
                    userName = "Contractor";
                    break;
            }
            let departmentName = constDepartment.get(departmentId);
            return res.render('activation', { employeeId: employeeId, fullName: fullName, userGroup: userName, departmentId: departmentName });
        }
        else {
            res.redirect("/login");
        }
    });
};

exports.activate = function(req, res){
    const employeeId = req.body.employeeId;
    const email = req.body.email;

    User.findOne({ employeeId }).then(user => {
        if (user) {
            User.findOne({ email }).then(user1 => {
                if (!user1 || user1.employeeId === employeeId){
                    // encrypt password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) { throw err; }
                            User.findOneAndUpdate({ employeeId : employeeId }, { $set : { email: email, password: hash, active: true } }, (err) => {
                                if (err) {
                                    res.json("Unexpected error.");
                                }
                                console.log(employeeId + " is active now");
                                res.redirect("/login");
                            });
                        });
                    });
                }
                else {
                    errors.message = "This email is associated with an existing account.";
                    res.render('/login', { error: errors });
                }
            })
        }
        else {
            errors.message = "This employee ID does not exist in the system.";
            res.render('/activation', { error: errors });
        }
    });
};
