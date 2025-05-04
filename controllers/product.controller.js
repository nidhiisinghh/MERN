const { validationResult } = require('express-validator')
let products = require('../db/models/product')
let mongoose = require('mongoose')
let { ObjectId } = mongoose.Types

let getAllProducts = async (req, res) => {
    let skip = req.query.skip || 0; 
    let limit = req.query.limit || 5; 
    let category = req.query.category;
    let minPrice = req.query.minPrice; 
    let maxPrice = req.query.maxPrice

    let query = {}; 
    if(category && category != ""){
        query["category"] = category; 
    }
    if((minPrice && minPrice > 0) || (maxPrice && maxPrice > 0)){
        if(minPrice && maxPrice && minPrice > maxPrice){
            return res.status(400).json({success: false, message: "minprice cannot be greater than maxprice"})
        }
        if(minPrice && maxPrice){
            query["price"] = {$lte: maxPrice, $gte: minPrice}
        }
        else if(minPrice && !maxPrice){
            query["price"] = {$gte: minPrice}
        }
        else if(maxPrice && !minPrice) {
            query["price"] = {$lte: maxPrice}
        }
    }

    let allProducts = await products.find(query).skip(skip).limit(limit);
    res.status(200).json({success: true, message: "Products fetched successfully", data: allProducts})}

let findProductByID = async (req, res) => {
    let productId = req.params.id; 
    let product = await products.findById(productId)

    if(!product){
        return res.status(404).json({success: false, message: "Product not found"})
    }

    return res.status(200).json({success: true, message: "Product fetched successfully", data: product})
}

let createProduct = async (req, res) => {
    try {
        let body = req.body
        let errors = validationResult(req); 
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let product = new products({
            name: body.name, 
            desc: body.desc, 
            price: body.price, 
            category: body.category, 
            imgUrl: body.imgUrl
        })

        await product.save(); 
        res.status(201).json({success:true,message:"Product Created successfully"});
    }

    catch(err) {
        res.status(400).json({success:false,message:err.message});
    }
}

let updateProduct = async (req, res) => {
    let productId = req.params.id; 
    let {newPrice, newDesc} = req.body; 
    let updatedProduct = await products.findById(productId);
    if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    if(newPrice && newPrice != ""){
        updatedProduct.price = newPrice; 
    }

    if(newDesc && newDesc != ""){
        updatedProduct.desc = newDesc
    }

    await updatedProduct.save();
    res.status(200).json({success: true, message: "product updated successfully"})
}

let deleteProduct = async (req, res) => {
    let productId = req.params.id; 
    await products.deleteOne({_id: ObjectId(productId)}); 
    res.status(200).json({success:true,message:"Product Deleted successfully"})
}

module.exports = {
    getAllProducts,
    findProductByID,
    createProduct,
    updateProduct,
    deleteProduct
}
