const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    imageUrl: {type: String, default: ""},
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }
}, {timestamps: true});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;