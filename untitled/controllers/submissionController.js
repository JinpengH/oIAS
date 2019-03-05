const User = require(".." + "/server/models/User");
const Submission = require(".." + "/server/models/Submission");
const cloudinary = require("cloudinary");
let multiparty = require("connect-multiparty");
const file_type = require("file-type");

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
    const submissionFields = {};

    submissionFields.linkedUserId = req.session.loginUserId;
    submissionFields.name = req.session.loginUser.fullName;
    submissionFields.title = req.body.title;
    submissionFields.type_ = req.body.type;
    submissionFields.description = req.body.description;
    submissionFields.dispense = parseFloat(req.body.dispense);
    submissionFields.departmentId = req.session.loginUser.departmentId;

    //req.session.loginUser.departmentId;

    // if (req.body.dateTime) submission
    // Fields.dateTime = req.body.dateTime;

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
        console.log(req.session.loginUser.fullName);
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
