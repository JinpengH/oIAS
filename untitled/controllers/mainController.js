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
                Submission.find({departmentId: sess.loginUser.departmentId, status:'Pending'}).then(departmentList=>{
                    console.log(departmentList[0]);
                    return res.render('main',{myList:list,departmentList:departmentList});
                })
            });
        }
        else if(user.userGroup === 3){ // VP
            Submission.find({departmentId: sess.loginUser.departmentId, status:'Pending', userGroup: 2}).then(departmentList=>{

                return res.render('main',{myList:{},departmentList:departmentList});
            })
        }
    };
