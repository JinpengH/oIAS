const User = require(".." + "/server/models/User");
const Submission = require(".." + "/server/models/Submission");
const constDepartment = require('../const/ConstDepartment');
const moment = require("moment");



exports.index = function(req, res, next) {
    let user = req.session.loginUser;
    if(typeof user === 'undefined'){
        const errors = {message: ""};
        res.redirect('/login');
    }
    else {
        Submission.find({linkedUserId: req.session.loginUserId}).then(list => {
            return res.render('statistic', {title: 'stat', list: list});
        });
    }
};



exports.getChartData = function(req,res){
    let days = req.params.n;
    let data = [];
    let listOfTimes = [];
    let dispense = 0;
    let i = 1;
    let d = new Date();
    let before = new Date();
    function asyncLoop(i, date, cb){
        if(i <= days){
            before = new Date(d.getTime()- (24 * 60 * 60 * 1000));
            Submission.find({linkedUserId: req.session.loginUserId, dateTime: {$gte:before, $lte:d}}).then(list => {
                listOfTimes.push(list.length);
                for(let j=0; j<list.length; j++){
                    dispense += list[j].dispense;
                }
                asyncLoop(i+1,cb);
            });
            d = before;
        }else{
            listOfTimes = listOfTimes.reverse();
            data.push(listOfTimes);
            data.push(dispense);
            res.send(data);
        }
    }
    asyncLoop(i,function(){
        callback({'lists':listOfTimes, 'dispense': dispense});
    });

};



exports.getList = function(req,res){
    let userGroup = req.session.loginUserGroup;
    let myList = [];
    //TODO add userGroup 3 and 4;
    switch(userGroup){
        case 1:
            myList.push([req.session.loginUserId,"me"]);
            res.send(myList);
            break;
        case 2:
            myList.push([req.session.loginUserId,"me"]);
            myList.push(["","------User------"]);
            User.find({departmentId: req.session.departmentId}).then(list=>{
                list.forEach(function(element){
                    myList.push([element.id,element.fullName]);
                });
                myList.push(['','-----Department-----']);
                myList.push([req.session.departmentId,constDepartment.get(req.session.departmentId)]);
                res.send(myList);
            });
            break;
        default:
            myList.push([req.session.loginUserId,"Me"]);
            res.send(myList);
            break;
    }
};
