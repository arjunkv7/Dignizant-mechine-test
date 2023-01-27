const express = require("express");
const router = express.Router();
let jwtauth = require("../lib/jwtlib").jwtauth;
let { addProduct, editProduct, deleteProduct, upload } = require("../controller/productController");

router.put("/editProduct",jwtauth, async (req, res) => {
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

router.delete("/delete",jwtauth, async (req, res) => {
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

router.post("/addProduct", upload.array("files"),async (req, res) => {
    try {
        let updatedProduct = await addProduct(req);
        console.log(req.body.product_id)
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