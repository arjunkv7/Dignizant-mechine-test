let userModel = require("../models/userModel");
let jwt = require("jsonwebtoken");
let config = require("../config").config;
let bcrypt = require("bcrypt");
let transporter = require("../config").transporter

let registerUser = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Email and username should be unique
            let emailExists = await userModel.findOne({ email: req.body.email });
            if (emailExists) return reject({ message: "This email already exists" });
            let usernameExists = await userModel.findOne({ username: req.body.username });
            if (usernameExists) return reject({ message: "This username already exists" });

            let createdUser = await userModel({
                name: req.body.name,
                username: req.body.username,
                mobile_number: req.body.mobile_number,
                email: req.body.email
            })
            //hash the password before storing it to the database
            createdUser.password = await createdUser.hashPassword(req.body.password);
            createdUser.save();

            resolve(createdUser);
        }
        catch (err) {
            console.log(err);
            reject(err)
        }
    });
}

let doLogin = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await userModel.findOne({ username: req.body.username });
            console.log(user);
            let token;
            if (user.validatePassword(req.body.password, user.password)) {
                let id = user._id
                token = await jwt.sign({ user_id: id }, config.JWTSECRET);
                user = user.toJSON();
                if (token) {
                    user.token = token;
                }
                resolve(user);
            }
            else {
                reject({ message: "Wrong password" });
            }
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

let editUser = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Email and username should be unique
            let emailExists = await userModel.findOne({ email: req.body.email, _id: { $ne: req.body._id } });
            if (emailExists) return reject({ message: "This email already exists" });
            let usernameExists = await userModel.findOne({ username: req.body.usernaem, _id: { $ne: req.body._id } });
            if (usernameExists) return reject({ message: "This username already exists" });

            //Hash the new password before storing 
            const saltRounds = 10;
            var salt = bcrypt.genSaltSync(saltRounds);
            var password = await bcrypt.hashSync(req.body.password, salt);

            console.log(password)
            let editedUser = await userModel.findByIdAndUpdate(req.body._id, {
                name: req.body.name,
                mobile_number: req.body.mobile_number,
                username: req.body.username,
                email: req.body.email,
                password: password,
            }, { new: true })
            //.select("-password")
            if (!editedUser) return reject({ message: "Please provide a valid _id" });
            resolve(editedUser);
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

let sendPasswordResetOtp = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await userModel.findOne({ username: req.body.username }).lean();
            if (!user) return reject({ message: "Please provide a valid username" });
            let OTP = Math.floor(1000 + Math.random() * 9000);

            await userModel.findByIdAndUpdate(user._id, {
                OTP: OTP
            })
            // create reusable transporter object using the default SMTP transport
            let info = await transporter.sendMail({
                from: 'arjunkvarju7@gmail.com', // sender address
                to: user.email, // list of receivers
                subject: "Password Reset OTP", // Subject line
                text: `Your password reset otp is ${OTP}`, // plain text body

            });

            resolve()
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

let resetPassword = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { username, otp, newPassword } = req.body;
            let user = await userModel.findOne({ username: username }).lean();
            if (user.OTP !== otp) return reject({ message: "Wrong OTP" })

            //Hash the new password before storing 
            const saltRounds = 10;
            var salt = bcrypt.genSaltSync(saltRounds);
            var password = await bcrypt.hashSync(newPassword, salt);
            let updatedUser = await userModel.findByIdAndUpdate(user._id,{
                password:password
            })
            resolve()
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
}
module.exports = {
    registerUser,
    doLogin,
    editUser,
    sendPasswordResetOtp,
    resetPassword
}