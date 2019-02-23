const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Load User Model
const User = require("../server/models/User");

//Load Submission Model
const Submission = require("../server/models/Submission");

const validatePostInput = require("../server/validation/post.validation.js");

// @route   POST submission/create
// @desc    Create Submission
// @access  Private
router.post(
    "/create",
    // passport.authenticate("jsonwebtoken", { session: false },  function(req, res) {}),
    (req, res) => {
        // check validation
        const { errors, isValid } = validatePostInput(req.body);
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }

        // get fields
        const submissionFields = {};
        submissionFields.linkedUserId = req.session.loginUserID;
        if (req.body.type) submissionFields.title = req.body.type;
        submissionFields.dispense = req.body.dispense;
        //TODO fixed departmentID
        submissionFields.departmentId = 1;
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
                    else return res.redirect("main");
                }
            );
        });
    }
);

// @route   DELETE /submission/delete/:submission_id
// @desc    Delete Submission
// @access  Private
router.delete(
    "/delete/:submission_id",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
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
    }
);

module.exports = router;
