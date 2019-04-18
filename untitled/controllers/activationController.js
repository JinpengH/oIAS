Submission = require("../server/models/Submission");
User = require("../server/models/User");
const bcrypt = require("bcryptjs");

exports.activation = function(req, res){
    const employeeId = req.query.employeeId;

    User.findOne({ employeeId }).then(user => {
        if (user) {
            const fullName = user.fullName;
            const userGroup = user.userGroup;
            const departmentId = user.departmentId;
            //console.log("Found user with employeeId " + employeeId);
            return res.render('activation', { employeeId: employeeId, fullName: fullName, userGroup: userGroup, departmentId: departmentId });
        }
        else {
            // alert("This employee ID does not exist in the system.");
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