const Product = require('../db/models/product')
const Order = require('../db/models/order')
const mongoose = require('mongoose')

const createOrder = async (req, res) =>{
    const {itemList, paymentMethod, address} = req.body; 
    const userId = req.userId; 

    try {

        const itemIds = itemList.map(product => product.productId); 
        const products = await Product.find({
            _id: {
                $in: itemIds
            }
        }); 

        const orderDetailList = itemList.map(product =>{
            const productDetails = products.find(p => p._id == product.productId); 

            if(!productDetails) {
                throw new Error ("product not found")
            }
            return {
                product: productDetails._id, 
                price: productDetails.price, 
                quantity: product.quantity
            }
        })

        const totalAmount = orderDetailList.reduce ((sum, item) => sum + (item.price*item.quantity), 0); 
        
        const order = new Order ({
            user: userId, 
            orderItem: orderDetailList, 
            address: address, 
            paymentMethod: paymentMethod, 
            totalAmount: totalAmount
        })

        const creatOrder = await order.save();
        res.status(201).json({success: true, message: "Order created successfully.", order: creatOrder})
    }

    catch(err) {
        console.log("errors", err);
        res.status(500).json({message: "error creating orders"})
    }
}

const getAllOrder = async (req, res) => {
    try {
        const allOrders = await Order.find({}); 
        res.status(202).json({success: true, message: "All orders fetched successfully", order: getAllOrder})
    }
    catch(err) {
        console.log("errors", err); 
        res.status(500).json({success:false, message: "Error fetching all the orders."})

    }
}

const getAllUserOrder = async (req, res) => {
    const userId = req.params.id; 

    try {
        const allOrders = await Order.find({user: userId}); 
        res.status(200).json({success: true, message: "all orders fetched successfully", order: allOrders})
    }
    catch(err) {
        console.log("errors", err); 
        res.status(500).json({success:false, message: "Error fetching all the orders."})

    }
}

const updateOrder = async (req, res) => {
    const {status, paymentMethod} = req.body; 
    const orderId = req.params.id; 

    try {
        const order = await Order.findById(orderId);
        if(!order) {
            res.status(404).json({success: false, message: "Order not found."})
        }

        const orderValues = {}; 
        if(status) {
            orderValues.status = status; 
        }
        if(paymentMethod){
            orderValues.paymentMethod = paymentMethod; 
        }

        await Order.updateOne({_id: orderId}, orderValues); 
        res.status(200).json({message: "order updated successfully.", order: orderValues}); 
    }
    catch(err) {
        console.log("errors", err); 
        res.status(500).json({success:false, message: "Error fetching all the orders."})

    }
    
}

const deleteOrder  = async (req, res) => {
    const orderId = req.params.id; 

    try {
        const order = await Order.findById(orderId); 
        if(!order){
            res.status(200).json({success: false, message: "Order not found."})
        }
        await Order.deleteOne({_id: orderId}); 
        res.status(200).json({success: true, message: "Order deleted successfully."})
    }

    catch (err) {
        console.log("errors", err); 
        res.status(500).json({message: "error deleting order", err: err.message})
    }
}

const getOrderById = async (req, res) => {
    const orderId = req.params.id; 

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.user.toString() != req.userId &&
        req.user.type != 1) {
        return res.status(403).json({ message: 'Not authorized to access this order' });
    }
    res.status(200).json({
        message: 'Order fetched successfully',
        order: order
    })
    }catch(err){
        console.log("Error", err);
        res.status(500).json({
            message: "Error fetching order",
            error: err.message
        })
    }
}

module.exports = {
    createOrder, 
    getAllOrder, 
    deleteOrder, 
    getOrderById, 
    updateOrder, 
    getAllUserOrder
}