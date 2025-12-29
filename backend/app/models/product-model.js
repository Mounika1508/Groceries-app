const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },  
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }
}, {timestamps: true}); 
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;   