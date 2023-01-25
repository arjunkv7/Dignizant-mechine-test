const express = require("express");
let { registerUser,doLogin,editUser } = require("../controller/userController")
let router = express.Router();

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

module.exports = router;