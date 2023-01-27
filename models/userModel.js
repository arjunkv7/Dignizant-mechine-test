const mongoose = require("mongoose");
const schema = mongoose.Schema;
const moment = require("moment");
const bcrypt = require("bcrypt");

let userSchema = new schema({
    name: String,
    username:String,
    mobile_number: String,
    password: String,
    email:String,
    OTP:String,
    date: {
        type: String,
        default: moment().format("YYYY-MM-DD")
    },
    time: {
        type: String,
        default: moment().format("HH:mm:ss")
    }
}, { timestamps: true, collection: "users" });

userSchema.methods.hashPassword = (password) => {
    const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};

userSchema.methods.validatePassword = (password, hashedPassword) => {
    let res = bcrypt.compareSync(password, hashedPassword);
    return res;
};

let userModel = mongoose.model("users", userSchema);

module.exports = userModel;