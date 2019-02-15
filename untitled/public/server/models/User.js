const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// SubSchema for comments
const commentSchema = mongoose.Schema({}, { _id: false });
mongoose.connect("mongodb+srv://oics2019:oics2019@cluster0-4fxam.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
var db = mongoose.connection;
// Create Schema for single User
const UserSchema = new Schema({
    employeeId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    userGroup:{
        type: Number,
        default: 0,
        required: true
    },
    departmentId:{
        type: Number,
        default: 0,
        required: true
    },
    submissions:{
        type: [String]
    },
    avatar: {
        type: String
    }
});


module.exports = User = mongoose.model("users", UserSchema);
module.exports.createUser = function(newUser, callback) {
    newUser.password = password;
    newUser.save();
};