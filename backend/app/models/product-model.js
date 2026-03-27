const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    netQnty: { type: String},
    image: { type: String, default: "" },
    publicId: { type: String, default: "" },
    stock: { type: Number },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },  
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }
}, {timestamps: true}); 
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;   