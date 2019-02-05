const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SubSchema for comments
const commentSchema = mongoose.Schema({}, { _id: false });
mongoose.connect("mongodb+srv://oics2019:oics2019@cluster0-4fxam.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
var db = mongoose.connection;
// Create Schema for single User
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
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