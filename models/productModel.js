const mongoose = require("mongoose");
const schema = mongoose.Schema;
const moment = require("moment");

let productSchema = new schema({
    name:String,
    price:Number,
    discount_price:Number,
    description:String,
    stock:Number,
    images:[String],
    date:{
        type:String,
        default:moment().format("YYYY-MM-DD")
    },
    time:{
        type:String,
        default:moment().format("HH:mm:ss")
    }
},{ timestamps:true,collection:"products"});

let productModel = mongoose.model("products",productSchema);

module.exports = productModel;