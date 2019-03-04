const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moment = require("moment");
const commentSchema = mongoose.Schema({}, { _id: false });
mongoose.connect("mongodb+srv://oics2019:oics2019@cluster0-4fxam.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
var db = mongoose.connection;
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
    },
    status:{
        type: String,
        default: "Pending"
    }
});

module.exports = Submission = mongoose.model("submission", SubmissionSchema);
