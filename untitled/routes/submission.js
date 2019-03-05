const express = require("express");
const router = express.Router();
const multiparty = require("connect-multiparty")();
// Load User Model
const User = require("../server/models/User");

//Load Submission Model
const Submission = require("../server/models/Submission");

//controller
const submission_controller = require("../controllers/submissionController");



// @route   POST submission/create
// @desc    Create Submission
// @access  Private
router.post(
    "/create",
    multiparty,submission_controller.submit);
    // passport.authenticate("jsonwebtoken", { session: false },  function(req, res) {}),


// @route   DELETE /submission/delete/:submission_id
// @desc    Delete Submission
// @access  Private
router.delete(
    "/delete/:submission_id",submission_controller.delete
    // passport.authenticate("jwt", { session: false }),
);


//router.post("/find/:n",submission_controller.find);
module.exports = router;
