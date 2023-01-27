const express = require("express");
let { registerUser,doLogin,editUser,sendPasswordResetOtp,resetPassword } = require("../controller/userController")
let router = express.Router();
let jwtauth = require("../lib/jwtlib");

router.post("/register", async (req, res) => {
    try {
        let registeredUser = await registerUser(req);
        res.json({ userDetails: registeredUser });
    }
    catch (err) {
        console.log(err);
        res.json({
            message: err.message
        })
    }
});

router.post("/login", async (req, res) => {
    try {
        let loginData = await doLogin(req);
        res.json({
            userDetails:loginData
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            message: err.message
        })
    }
})

router.put("/edit",async (req,res)=>{
    try{
        let editedUser = await editUser(req);
        res.json({
            message:"User details edited successfully",
            userDetails:editedUser
        })
    }
    catch(err){
        console.log(err);
        res.json({
            message:err.message
        })
    }
})

router.post("/forgot-password",async (req,res)=>{
    try{
        let data = await sendPasswordResetOtp(req)
        res.json({ message:"OTP send successfully"})
    }
    catch(err){
        console.log(err);
        res.json({
            message:err.message
        })
    }
})

router.post("/reset-password",async (req,res)=>{
    try{
        let data = await resetPassword(req);
        res.json({
            message:"Password changed successfully"
        })
    }
    catch(err){
        console.log(err);
        res.json({
            message:err.message
        })
    }
})

module.exports = router;