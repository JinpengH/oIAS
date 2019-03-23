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
        trim: true,
        required: true
    },
    active: {
        type: Boolean, // false = not activated, true = active
        required: true
    },
    email: {
        type: String,
        default: "",
        trim: true
    },
    password: {
        type: String,
        default: ""
    },
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    userGroup:{
        type: Number, // 0 = admin, 3 = VP, 2 = team lead, 1 = employee, 4 = contractor
        required: true
    },
    departmentId:{
        type: Number,
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