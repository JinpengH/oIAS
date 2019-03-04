const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
var multiparty = require("connect-multiparty")();
// Load User Model
const User = require("../server/models/User");

//Load Submission Model
const Submission = require("../server/models/Submission");

//controller
const submission_controller = require("../controllers/submissionController");
const validatePostInput = require("../server/validation/post.validation.js");



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

module.exports = router;
