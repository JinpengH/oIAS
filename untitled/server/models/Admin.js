const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// SubSchema for comments
const commentSchema = mongoose.Schema({}, { _id: false });
mongoose.connect("mongodb+srv://oics2019:oics2019@cluster0-4fxam.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
var db = mongoose.connection;
// Create Schema for single User
const AdminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
    },
    userGroup:{
        type: Number,
        default: 0,
        required: true
    },
});

//admin exists on database only and cannot be changed otherwise
module.exports = User = mongoose.model("admin", AdminSchema);
