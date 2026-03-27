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
    if (!customer) return res.status(404).json({ error: "Customer profile not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ customerId: customer._id });

    // First item in cart
    if (!cart) {
      cart = new Cart({
        customerId: customer._id,
        vendorId: product.vendorId,
        items: [
          {
            productId: product._id,
            quantity,
            itemTotal: product.price * quantity
          }
        ]
      });
    } 
    else {
      // Prevent mixing vendors
      if (cart.vendorId.toString() !== product.vendorId.toString()) {
        return res.status(400).json({ error: "Cannot mix vendor products" });
      }

      const index = cart.items.findIndex(i => i.productId.toString() === productId);

      if (index >= 0) {
        cart.items[index].quantity += quantity;
        cart.items[index].itemTotal =
          cart.items[index].quantity * product.price;
      } else {
        cart.items.push({
          productId: product._id,
          quantity,
          itemTotal: product.price * quantity
        });
      }
    }

    // Recalculate subtotal
    cart.subtotal = cart.items.reduce((sum, i) => sum + i.itemTotal, 0);

    await cart.save();

    // Always populate before sending
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
      "name price image stock"
    );

    return res.json(populatedCart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

//view cart
cartCtlr.viewCart = async (req, res) => {
  try {
    const userId = req.userId;
    const customer = await Customer.findOne({ userId });

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const cart = await Cart.findOne({ customerId: customer._id }).populate("items.productId", "name price image stock");

    if (!cart) return res.json({ cart: null });

    return res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


cartCtlr.updateItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    const customer = await Customer.findOne({ userId });
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    let cart = await Cart.findOne({ customerId: customer._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId   // FIXED
    );

    if (index === -1) return res.status(404).json({ error: "Item not in cart" });

    if (quantity === 0) {
      cart.items.splice(index, 1);

      if (cart.items.length === 0) {
        await Cart.deleteOne({ customerId: customer._id });
        return res.json({ cart: null });
      }
    } else {
      const product = await Product.findById(productId);
      cart.items[index].quantity = quantity;
      cart.items[index].itemTotal = product.price * quantity;
    }

    cart.subtotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);

    await cart.save();

    const updated = await Cart.findById(cart._id).populate(
      "items.productId",
      "name price stock image"
    );

    return res.json(updated);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



cartCtlr.removeItem = async (req, res) => {
    try {
        const userId = req.userId;  
        const { productId } = req.params;  
        const customer = await Customer.findOne({ userId });
        if (!customer) {
            return res.status(404).json({ error: "Customer profile not found" });
        }
        const cart = await Cart.findOne({ customerId: customer._id });    
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        if(cart.items.length === 0){
            await Cart.deleteOne({ customerId: userId });
            return res.status(200).json({ error: "Item removed from cart. Cart is now empty.", cart: null });
        }
        await cart.save();
        res.status(200).json({ error: "Item removed from cart", cart });      
    } catch (error) {
        res.status(500).json({ error: error.message });
    }       
}

module.exports = cartCtlr;