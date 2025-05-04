const { validationResult } = require('express-validator')
const products = require('../db/models/product')
const mongoose = require('mongoose')

const getAllProducts = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0
        const limit = parseInt(req.query.limit) || 5
        const category = req.query.category
        const minPrice = parseFloat(req.query.minPrice)
        const maxPrice = parseFloat(req.query.maxPrice)

        const query = {}
        if (category?.trim()) {
            query.category = category
        }

        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            query.price = {}
            if (!isNaN(minPrice) && minPrice > 0) query.price.$gte = minPrice
            if (!isNaN(maxPrice) && maxPrice > 0) query.price.$lte = maxPrice
            
            if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum price cannot be greater than maximum price"
                })
            }
        }

        const allProducts = await products.find(query)
            .skip(skip)
            .limit(limit)
            .exec()

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: allProducts
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: err.message
        })
    }
}

const getProductByID = async (req, res) => {
    try {
        const productId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            })
        }

        const product = await products.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: err.message
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const { name, desc, price, category, imgUrl } = req.body

        // Additional validation
        if (!name || !desc || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a positive number"
            })
        }

        const product = new products({
            name,
            desc,
            price,
            category,
            imgUrl
        })

        await product.save()
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error: err.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            })
        }

        const { newPrice, newDesc } = req.body
        if (!newPrice && !newDesc) {
            return res.status(400).json({
                success: false,
                message: "No updates provided"
            })
        }

        const updatedProduct = await products.findById(productId)
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (newPrice) {
            if (typeof newPrice !== 'number' || newPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Price must be a positive number"
                })
            }
            updatedProduct.price = newPrice
        }

        if (newDesc?.trim()) {
            updatedProduct.desc = newDesc
        }

        await updatedProduct.save()
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error: err.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            })
        }

        const product = await products.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        await products.findByIdAndDelete(productId)
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: err.message
        })
    }
}

module.exports = {
    getAllProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
}
