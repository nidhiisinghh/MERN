const mongoose = require('mongoose'); 
const OrderItemSchema = require('./orderItem');
const objectId = mongoose.Schema.ObjectId; 

const OrderSchema = new mongoose.Schema ({
    user: {
        type: objectId, 
        required: true
    },
    address: {
        type: String, 
        required: true
    }, 
    orderItem: {
        type: [OrderItemSchema], 
        required: true
    }, 
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    paymentMethod: {
        type: String, 
        enum: ["Cod", "Online"],
        default: "Cod"
    }, 
    paymentStatus: {
        type: String, 
        enum: ["Paid", "Pending", "Failed"], 
        default: "Pending"
    }, 
    totalAmount: {
        type: Number, 
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date, 
        default: Date.now
    }
})

module.exports = mongoose.model("orders", OrderSchema);