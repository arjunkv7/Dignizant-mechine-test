let productModel = require("../models/productModel");
const multer = require('multer');
const path = require('path');

//set path of product images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/productImages/');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage });

let addProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {

            let images = [];
            await req.files.map(e=>{
                images.push(e.filename)
            })
            console.log(req.body.product_id)

            let addedProduct = await productModel({
                name: req.body.name,
                price: req.body.price,
                stock:req.body.stock,
                discount_price: req.body.discount_price,
                description: req.body.description,
                images:images
            }).save()
            resolve(addedProduct);
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

let editProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let editedProduct = await productModel.findByIdAndUpdate(req.body.product_id, {
                name: req.body.name,
                price: req.body.price,
                discount_price: req.body.discount_price,
                description: req.body.description,
            }, { new: true })
            if (!editedProduct) return reject({ message: "Please provide a valid product_id" })
            resolve(editedProduct);
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
};

let deleteProduct = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deletedProduct = await productModel.findByIdAndRemove(req.body.product_id);
            resolve(deletedProduct);
            console.log(deletedProduct);
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
}




module.exports = {
    addProduct,
    editProduct,
    deleteProduct,
    upload,
    
}