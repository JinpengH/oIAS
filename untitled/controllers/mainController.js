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
        else{ // 1 = employee, 4 = contractor
            Submission.find({linkedUserId: sess.loginUserId}).then(list =>{
                return res.render('main',{myList:list,float:true});
            });
        }

    };

exports.other =
    function(req,res){
        Submission.find({departmentId: req.session.departmentId, status:'Pending', userGroup: {$gte:1, $lte:2}}).then(departmentList=>{

            return res.render('other',{myList:{},departmentList:departmentList,float:false});
        })
    };
