const express = require("express");
const router = express.Router();
let { addProduct, editProduct, deleteProduct, upload, storeImages } = require("../controller/productController")

router.post("/addProduct", async (req, res) => {
    try {
        let addedProduct = await addProduct(req);
        res.json({
            message: "Product added",
            productDetails: addedProduct
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            message: err.message
        })
    }
});

router.put("/editProduct", async (req, res) => {
    try {
        let editedProduct = await editProduct(req);
        res.json({
            message: "Product edited",
            productDetails: editedProduct
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            message: err.message
        })
    }
});

router.delete("/delete", async (req, res) => {
    try {
        let result = await deleteProduct(req);
        res.json({
            message: "Product deleted successfully"
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            message: err.message
        })
    }
})

router.post("/uploadImages", upload.array("files"),async (req, res) => {
    try {
        let updatedProduct = await storeImages(req);
        res.json({
            message: "Image uploaded",
            productDetails: updatedProduct
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            message: err.message
        })
    }
})

module.exports = router;