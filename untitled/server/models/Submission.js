const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require("moment");

// Create Schema for single Post
const SubmissionSchema = new Schema({
    linkedUserId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    departmentId:{
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type_:{
        type: String,
        required: true
    },
    description: {
        type: String,
        default: false
    },
    dateTime: {
        type: Date,
        default: moment().format()
    },
    dispense:{
        type: Number,
        required: true
    },
    file_url:{
        type: String,
        default: ""
    }
});

module.exports = Submission = mongoose.model("submission", SubmissionSchema);
