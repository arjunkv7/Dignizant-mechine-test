const jwt = require("jsonwebtoken");
let config = require("../config").config
let userModel = require("../models/userModel");

let verifyToken = (token, next) => {
  try {
    var decoded = jwt.verify(token, config.JWTSECRET);
    return { ...decoded, expired: false };
  } catch (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        var decoded = jwt.decode(token);
        if (decoded) {
          return { ...decoded, expired: true };
        } else return false;
      } else return false;
    }
  }
};

let tokenValidation = async (req, res, next) => {
  let token = req.headers["token"];
  console.log(token)
  if (!token) res.status(400).json({ status: 400, message: "User does not have  token", });
  req.token = token;
  try {
    const decodedToken = verifyToken(req.token, next);

    if (!decodedToken) {
        res.status(400).json({
        status: 400,
        message: "User does not have  token",
      });
    } 
    else if (decodedToken.expired) {
      
      res.status(400).json({
        status: 400,
        message: "Token expired",
      });
    }
    else {
      let user = await userModel.findOne({
        _id: decodedToken.user_id,
      });
      user.token = req.token;
      req.user = user;
      console.log(req.user)
      next()
    }
  }
  catch (err) {
    console.log(err);

    res.status(400).json({
      status: 400,
      message: "Error with your token",
    });
  }
}


module.exports.jwtauth = tokenValidation
