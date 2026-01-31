const Order = require('../models/order-model');
const Customer = require('../models/customer-model');
const Cart = require('../models/cart-model');
const Vendor = require('../models/vendor-model');
const DeliveryBoy = require("../models/deliveryBoy-model");
const { sendSMS } = require('../utils/sms');
const orderCtlr = {};
// Place a new order
orderCtlr.placeOrder = async (req, res) => {
    try {   
        const customerId = req.userId;
        const customer = await Customer.findOne({userId: customerId});
        if(!customer){
            return  res.status(404).json({message: "Customer profile not found"});
        }
        const cart = await Cart.findOne({ customerId: customer._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }   
        let totalAmount = 0;    
        const products = cart.items.map(item => {
            totalAmount += item.price * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
                
            };
        });

        const order = await Order.create({
            customerId: customer._id,
            vendorId: cart.vendorId,    
            products,
            totalAmount,
            status: 'placed'
        });
        await sendSMS(customer.mobile, "Your order has been placed successfully." ); 
        await Cart.deleteOne({customerId: customer._id});
        res.status(201).json({message: "Order placed successfully", order});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }   
};

orderCtlr.getMyOrders = async (req, res) => {
    try {
        const customerId = req.userId;
        const orders = await Order.find({ customerId }).populate('products.productId', 'name imageUrl ').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }   
};  

orderCtlr.cancelOrder = async (req, res) => {
    try {
        const customerId = req.userId;  
        const orderId = req.params.id;
        const order = await Order.findOne({ _id: orderId, customerId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }

        if (order.status !== 'placed') {
            return res.status(400).json({ message: 'Order cannot be cancelled' });
        }

        order.status = 'cancelled';
        await order.save();

        res.json({ message: 'Order cancelled successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
// Implementation for starting packing
orderCtlr.startPacking = async (req, res) => {
    try {
        const vendorId = req.userId;
        const orderId = req.params.id;
        const vendor = await Vendor.findOne({ userId: vendorId });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }   
        const order = await Order.findOne({ _id: orderId, vendorId: vendor._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }   
        if (order.status !== 'placed') {
            return res.status(400).json({ message: 'Order cannot be moved to packing' });
        }   
        order.status = 'packing';
        await order.save();   
        const customer = await Customer.findById(order.customerId);
        await sendSMS(customer.mobile, "Your order is being packed and will be dispatched soon.");  
        res.json({ message: 'Order status updated to packing' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }          
};

orderCtlr.assignDeliveryBoy = async (req, res) => { 
    try {
        const orderId = req.params.id;
        const vendorId = req.userId;
        const deliveryBoyId = req.body.deliveryBoyId;   
        const vendor = await Vendor.findOne({ userId: vendorId });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }   
        const order = await Order.findOne({ _id: orderId, vendorId: vendor._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }   
        if (order.status !== 'packing') {
            return res.status(400).json({ message: 'Delivery boy can only be assigned when order is in packing status' });
        }   
        const deliveryBoy = await DeliveryBoy.findOne({ _id: deliveryBoyId, isAvailable: true });
        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery boy not found or not assigned to your vendor' });
        }   
        order.deliveryBoyId = deliveryBoy._id;
        order.status = 'on-the-way';
        deliveryBoy.isAvailable = false;
        await deliveryBoy.save();
        await order.save();   
        const customer = await Customer.findById(order.customerId);
        await sendSMS(customer.mobile, "Your order is on the way 🚚 ")
        res.json({ message: 'Delivery boy assigned and order status updated to on-the-way' });
    } catch (err) {             
        console.log(err);
        res.status(500).json({ error: err.message });
    }   
};

orderCtlr.markAsDelivered = async (req, res) => {
    try {
        const deliveryBoyId = req.userId;
        const orderId = req.params.id;
        const deliveryBoy = await DeliveryBoy.findOne({ userId: deliveryBoyId });
        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery boy profile not found' });
        }
        const order = await Order.findOne({ _id: orderId, deliveryBoyId: deliveryBoy._id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }
        if (order.status !== 'on-the-way') {
            return res.status(400).json({ message: 'Order cannot be marked as delivered' });
        }
        order.status = 'delivered';
        await order.save();
        await DeliveryBoy.findByIdAndUpdate(deliveryBoy._id, { isAvailable: true });   
        const customer = await Customer.findById(order.customerId);
        await sendSMS(customer.mobile, "Your order has been delivered successfully ✅")
        res.json({ message: 'Order delivered successfully', order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = orderCtlr;
