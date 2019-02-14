const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require("moment");

// Create Schema for single Post
const SubmissionSchema = new Schema({
    linked_userid: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: true
    },
    state: {
        type: Boolean,
        default: false
    },
    author: {
        type: String,
        default: "Anonymous"
    },
    dateTime: {
        type: Date,
        default: moment().format()
    }
});

module.exports = Submission = mongoose.model("submission", SubmissionSchema);
