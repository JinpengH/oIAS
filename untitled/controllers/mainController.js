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
        else {
            const submissions = Submission.find({linkedUserId: sess.loginUserId}).then(list =>{
                return res.render('main',{list:list});
            });
        }
    };
