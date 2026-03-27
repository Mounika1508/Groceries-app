const Product = require("../models/product-model");
const Category = require("../models/category-model");
const cloudinary = require("../middlewares/cloudinary");
const fs = require("fs");
const productValidationSchema = require("../validations/product-validation");
const Vendor = require("../models/vendor-model");   
const productCtlr = {};

// Create a new product
productCtlr.create = async (req, res) => {
    try{
        const body = req.body;  
        const userId = req.userId;
        const {error, value} =  productValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }   
        if(req.role !== 'vendor'){
            return res.status(403).json({error: "Only vendors can create products"});
        }
        const vendor = await Vendor.findOne({userId});
        if(!vendor || !vendor.isApproved){
            return res.status(403).json({error: "Vendor profile not found or not approved"});
        }   
        const category = await Category.findOne({  _id: value.categoryId, vendorId: vendor._id});
        if(!category){
            return res.status(400).json({error: "You are not allowed to add product in this category"});
        }   
        const existingProduct = await Product.findOne({name: value.name, vendorId: vendor._id});
        if(existingProduct){
            return res.status(400).json({error: "Product with this name already exists for this vendor"});
        }
        let image = "";
        let publicId = "";
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products'
        });
        fs.unlinkSync(req.file.path); // Remove file from server after upload
        image = result.secure_url;
        publicId = result.public_id;
        }
        const product = await Product.create({        
            vendorId: vendor._id, 
            name: value.name,        
            description: value.description,
            price: value.price,
            netQnty: value.netQnty,
            stock: value.stock,
            image: image,
            publicId: publicId,
            categoryId: value.categoryId,
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({error: error.message});     
    }
}

//list products by vendor
productCtlr.listByVendor = async (req, res) => {
    try{
        const userId = req.userId;
        const vendor = await Vendor.findOne({userId});
        if(!vendor || !vendor.isApproved){
            return res.status(403).json({error: "Vendor profile not found or not approved"});
        }
        const products = await Product.find({vendorId: vendor._id}).populate('categoryId', 'name').populate('vendorId', 'shopName');
        res.json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//public List for customers
productCtlr.publicList = async (req, res) => {
    try{
        const products = await Product.find().populate('categoryId', 'name').populate('vendorId', 'shopName');
        res.json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }   
}

//update product
productCtlr.update = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const userId = req.userId;

    const vendor = await Vendor.findOne({ userId });
    if (!vendor || !vendor.isApproved) {
      return res.status(403).json({ error: "Vendor not approved" });
    }

    // STEP 1: Find old product
    const oldProduct = await Product.findOne({ _id: id, vendorId: vendor._id });
    if (!oldProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // STEP 2: If new image uploaded → delete old one
    if (req.file) {
      if (oldProduct.publicId) {
        await cloudinary.uploader.destroy(oldProduct.publicId);
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      fs.unlinkSync(req.file.path);

      body.image = result.secure_url;
      body.publicId = result.public_id;
    }

    // Validate
    const { error, value } = productValidationSchema.validate(body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const updated = await Product.findOneAndUpdate(
      { _id: id, vendorId: vendor._id },
      value,
      { new: true }
    )
      .populate("categoryId", "name")
      .populate("vendorId", "shopName");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//delete product
productCtlr.remove = async (req, res) => {
  try {
    const id = req.params.id;

    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor || !vendor.isApproved) {
      return res.status(403).json({ error: "Vendor not approved" });
    }

    const product = await Product.findOne({ _id: id, vendorId: vendor._id });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete Cloudinary image
    if (product.publicId) {
      await cloudinary.uploader.destroy(product.publicId);
    }

    await Product.findOneAndDelete({ _id: id, vendorId: vendor._id });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = productCtlr;