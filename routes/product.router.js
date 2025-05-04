const express = require('express'); 
const { check } = require('express-validator'); 
const { getAllProducts, getProductByID, updateProduct, createProduct, deleteProduct} = require('../controllers/product.controller')

const auth = require('../middleware/auth')
const isAdmin = require ('../middleware/isAdmin')

let productRouter = express.Router(); 

productRouter.get("/", getAllProducts); 
productRouter.get("/:id", getProductByID); 
productRouter.post("/", [
    check('name').isLength({ min: 5 })        
], isAdmin, createProduct);
productRouter.patch("/:id", [isAdmin], updateProduct);
productRouter.delete("/:id", [isAdmin], deleteProduct);

module.exports = productRouter; 