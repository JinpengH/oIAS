Submission = require("../server/models/Submission");
User = require("../server/models/User");

exports.index =
    function(req,res){
        //const name = req.name;
        //const user = req.user;
        //res.render('main', { title: 'main', name, user});
        const sess = req.session;
        user = sess.loginUser;
        if(typeof user === 'undefined'){
            const errors = {message: ""};
            res.render('login',{error:errors});
        }
        else if(user.userGroup === 1){ // employee
            Submission.find({linkedUserId: sess.loginUserId}).then(list =>{
                return res.render('main',{myList:list});
            });
        }
        else if(user.userGroup === 2){ // team lead
            Submission.find({linkedUserId: sess.loginUserId}).then(list =>{
                User.find({userGroup: 1,departmentId: sess.loginUser.departmentId}).then(userList=>{
                    Submission.find({departmentId: sess.loginUser.departmentId, status:'Pending',}).then(departmentList=>{
                        let employeeList = [];
                        userList.forEach(function(user){
                            departmentList.forEach(function(submissions){

                                if (submissions.linkedUserId.equals(user._id)){
                                    employeeList.push(submissions);
                                    console.log(user);
                                    console.log(submissions);
                                }
                            })
                        });
                        return res.render('main',{myList:list,departmentList:employeeList});
                    })
                })

            });
        }
        else if(user.userGroup === 3){ // VP
            Submission.find({departmentId: sess.loginUser.departmentId, status:'Pending', userGroup: 2}).then(departmentList=>{

                return res.render('main',{myList:{},departmentList:departmentList});
            })
        }
    };
