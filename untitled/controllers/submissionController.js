const User = require(".." + "/server/models/User");
const Submission = require(".." + "/server/models/Submission");
const cloudinary = require("cloudinary");


const moment = require("moment");

cloudinary.config({
    cloud_name: 'oben',
    api_key: '551697429239191',
    api_secret: 'w7WU2I1H0BC11GCJS6Q6nOAW-9s'
});


exports.delete = (req, res) => {
    Submission.findOneAndDelete(
        { _id: req.params.submission_id },
        { safe: true, useFindAndModify: false }
    )
        .then(submission => {
            if (submission) {
                User.findOneAndUpdate(
                    { _id: submission.linkedUserId },
                    { $pull: { submissions: submission._id} },
                    { safe: true, useFindAndModify: false }
                )
                    .then(user => res.json(user))
                    .catch(err => res.status(404).json({ user: "No such user found" }));
            }
        })
        .catch(err =>
            res.status(404).json({ submissions: "There is no content for this post" })
        );
};

exports.submit = (req, res) => {
    // get fields
    console.log("debug");
    const submissionFields = {};
    submissionFields.linkedUserId = req.session.loginUserId;
    submissionFields.name = req.session.loginUser.fullName;
    submissionFields.title = req.body.title;
    submissionFields.type_ = req.body.type;
    submissionFields.description = req.body.description;
    submissionFields.dispense = parseFloat(req.body.dispense);
    submissionFields.departmentId = req.session.loginUser.departmentId;
    submissionFields.date = moment().format('MMM Do YY').toString();
    //console.log(moment(new date()).format('MM/DD/YYYY'));
    // save post
    new Submission(submissionFields).save().then(submission => {
        // update User Model
        User.findOneAndUpdate(
            { _id: submissionFields.linkedUserId },
            { $push: { submissions: submission.id } },
            { safe: true, upsert: true, new: true, useFindAndModify: false },
            (err) => {
                if (err) return res.status(400).json(err);
                else {
                    return res.redirect('/main');
                }
            }
        );
        // console.log(req);
        const filepath = req.files.file.path;

        //console.log("uploading...  " + filepath);


        const email = req.session.loginUser.email;
        User.findOne({ email }).then(user => {
            req.session.loginUser = user;
        });
        cloudinary.v2.uploader.upload(
            filepath,
            { public_id: submission.id },
            function(error, result) {
                // res.json(result);
                //console.log(result, error);
                let new_url = result.url;
                Submission.findOneAndUpdate(
                    { _id: submission.id },
                    { $set: { file_url: new_url } },
                    // { $set: postFields },
                    { new: true, useFindAndModify: false }
                )
                    .then(submission => console.log(submission))
                // .catch(err => res.status(400).json(err));
            });
    });
};

exports.search = function(req,res){
    let searchTerm = req.params.searchTerm;
    let days = req.params.days;
    if(days === 0){days = 365;}//TODO
    let statusQuery = req.params.status;

    let dateQuery = [];
    let day = moment();
    for(let i = 0; i < days; i++){
        dateQuery.push(day.format('MMM Do YY').toString());
        day = day.subtract(1, 'days');
        console.log(day.format('MMM Do YY').toString());
    }
    let searchTermQuery;
    let query;
    if(isNaN(searchTerm)){
        if(statusQuery === 'All') {
            query = {
                linkedUserId: searchTerm,

                date: {$in: dateQuery}
            };
        }
        else{
            query = {
                linkedUserId: searchTerm,
                status: statusQuery,
                date: {$in: dateQuery}
            };
        }
    }
    else {
        if (statusQuery === 'All') {
        query = {
            departmentId: searchTerm,

            date: {$in: dateQuery}
        };
    }
        else{
            query = {
                departmentId: searchTerm,
                status:statusQuery,
                date: {$in: dateQuery}
            };
        }
    }
    Submission.find(query).then(list=>{res.send(list);})
};

exports.approve = function(req,res){
    let id = req.params.id;
    Submission.findOneAndUpdate({ _id : id }, { $set : { status:"Approved" } }).then(data=>{res.send(data);})
};

exports.decline = function(req,res){
    let id = req.params.id;
    Submission.findOneAndUpdate({ _id : id }, { $set : { status:"Declined" } }).then(data=>{
        res.send(data);
    })
};