const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config")

const port = config.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "public")));

mongoose.connect(config.DBURL,
    {
        keepAlive: 1,
        connectTimeoutMS: 30000,
    },(err)=> {
    if(err)console.log(err)
    console.log("Db connected");
});

let userRouter = require("./router/userRouter");
app.use("/user", userRouter);

let productRouter = require("./router/productRouter");
app.use("/products",productRouter);


app.listen(port, (err) => {
    if (err) console.log(err);
    console.log("app is listening on port " + port)
});

