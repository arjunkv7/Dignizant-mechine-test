const nodemailer = require("nodemailer");

let config = {
    DBURL: "mongodb+srv://Arjunroot:1SJGLHNPYdHTdraC@cluster0.scesfd7.mongodb.net/test",
    JWTSECRET: "sjowenjhfikujiowebjksdffjnkl",
    PORT: 4000
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "arjunkvarju7@gmail.com", // generated ethereal user
        pass: "iqfkzgmhbwunoyod", // generated ethereal password
    },
}); 
module.exports ={ config,transporter} ;