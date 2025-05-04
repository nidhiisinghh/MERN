const mongoose = require ('mongoose'); 
const express = require('express'); 
const {createOrder, getAllOrder, getOrderById, getAllUserOrder, updateOrder, deleteOrder} = require('../controllers/order.controller')
const auth = require('../middleware/auth'); 
const isAdmin = require('../middleware/isAdmin'); 
const {check} = require('express-validator'); 

const orderRouter = express.Router();

orderRouter.post('/', [
    check("itemList").not().isEmpty(),
    check("address").not().isEmpty(),
    check("paymentMethod").not().isEmpty(),
    auth], createOrder); 

orderRouter.get("/", isAdmin,getAllOrder);
orderRouter.get("/user/orders", auth, getAllUserOrder)
orderRouter.get('/:id', auth, getOrderById);
orderRouter.patch("/:id", isAdmin, updateOrder);
orderRouter.delete("/:id", isAdmin, deleteOrder)


module.exports = orderRouter;
