let userModel = require("../models/userModel");
let jwt =  require("jsonwebtoken");
let config = require("../config");
let bcrypt = require("bcrypt");

let registerUser = (req)=>{
    return new Promise(async (resolve, reject) => {
        try{
            let createdUser = await userModel({
                name: req.body.name,
                username:req.body.username,
                mobile_number: req.body.mobile_number,
            })
            //hash the password before storing it to the database
            createdUser.password = await createdUser.hashPassword(req.body.password);
            createdUser.save();

            resolve(createdUser);
        }
        catch(err){
            console.log(err);
            reject(err)
        }
    });
}

let doLogin = (req)=>{
    return new Promise(async (resolve, reject) => {
        try{
        let user = await userModel.findOne({username:req.body.username});
        console.log(user);
        let token ;
        if(user.validatePassword(req.body.password,user.password)){
            let id = user._id
            token = await jwt.sign({user_id:id},config.JWTSECRET);
            user = user.toJSON();
            if(token){
                user.token = token;
            }
            resolve(user);
        }
        else{
            reject({message:"Wrong password"});
        }
    }
    catch(err){
        console.log(err);
        reject(err);
    }
    });
}

let editUser = (req)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            //Hash the new password before storing 
            const saltRounds = 10;
            var salt = bcrypt.genSaltSync(saltRounds);
            var password = await bcrypt.hashSync(req.body.password, salt);

            console.log(password)
            let editedUser = await userModel.findByIdAndUpdate(req.body._id,{
                name:req.body.name,
                mobile_number:req.body.mobile_number,
                username:req.body.username,
                password:password,
            },{ new:true})
            //.select("-password")
            if(!editedUser) return reject({message:"Please provide a valid _id"});
            resolve(editedUser);
        }
        catch(err){
            console.log(err);
            reject(err);
        }
    })
}
module.exports = {
    registerUser,
    doLogin,
    editUser
}