const Cart = require('../models/cart-model');
const Customer = require('../models/customer-model');
const Product = require('../models/product-model');

const cartCtlr = {};
// Add item to cart
cartCtlr.addItem = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity = 1 } = req.body;
        const customer = await Customer.findOne({ userId });    
        if(!customer){
            return res.status(404).json({ message: "Customer profile not found" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }   
        let cart = await Cart.findOne({ customerId: customer._id });
        if(cart){
            if(cart.vendorId.toString() !== product.vendorId.toString()){
                return res.status(400).json({ message: "Cannot add products from different vendors to the same cart." });
            }
            const itemIndex = cart ? cart.items.findIndex(item => item.productId.toString() === productId) : -1;
                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += quantity;
                } else {
                    cart.items.push({ productId, quantity, price: product.price, name: product.name, image: product.imageUrl });
               }    
           } else {
            cart = await Cart.create({
                customerId: customer._id,
                vendorId: product.vendorId,
                items: [{ productId, quantity, price: product.price, name: product.name, image: product.imageUrl }]
            });
        }
        await cart.save();  
        res.status(200).json({message: "Item added to cart", cart});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}
//view cart
cartCtlr.viewCart = async (req, res) => {
    try {
        const userId = req.userId;  
        const cart = await Cart.findOne({ customerId: userId }).populate('items.productId', "name imageUrl");
        if (!cart) {
            return res.status(404).json({cart: null});
        }   
        let subtotal = 0;
        let totalItems = 0;
        const items = cart.items.map(({ productId, quantity, price }) => {
            const itemTotal = price * quantity;
            subtotal += itemTotal;
            totalItems += quantity;
            return {
                productId: productId._id,
                name: productId.name,
                image: productId.imageUrl,
                quantity,
                price,
                itemTotal
            };
        })
        res.json( { _id: cart._id, items, subtotal, totalItems, vendorId: cart.vendorId } );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

cartCtlr.updateItem = async (req, res) => {
    try {
        const userId = req.userId;
        const {productId} = req.params;
        const { quantity } = req.body;
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }
        const cart = await Cart.findOne({ customerId: userId });    
        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }
        const item = cart.items.find(item => item.productId.toString() === productId);
        if(!item){
            return res.status(404).json({ message: "Item not found in cart" });
        }
        item.quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Cart item updated", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }       
}

cartCtlr.removeItem = async (req, res) => {
    try {
        const userId = req.userId;  
        const { productId } = req.params;  
        const cart = await Cart.findOne({ customerId: userId });    
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        if(cart.items.length === 0){
            await Cart.deleteOne({ customerId: userId });
            return res.status(200).json({ message: "Item removed from cart. Cart is now empty.", cart: null });
        }
        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });      
    } catch (error) {
        res.status(500).json({ message: error.message });
    }       
}

module.exports = cartCtlr;