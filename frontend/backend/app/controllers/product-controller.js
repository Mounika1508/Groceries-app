const Product = require("../models/product-model");
const Category = require("../models/category-model");
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
            return res.status(403).json({message: "Only vendors can create products"});
        }
        const vendor = await Vendor.findOne({userId});
        if(!vendor || !vendor.isApproved){
            return res.status(403).json({message: "Vendor profile not found or not approved"});
        }   
        const category = await Category.findOne({  _id: value.categoryId, vendorId: vendor._id});
        if(!category){
            return res.status(400).json({message: "You are not allowed to add product in this category"});
        }   
        const existingProduct = await Product.findOne({name: value.name, vendorId: vendor._id});
        if(existingProduct){
            return res.status(400).json({message: "Product with this name already exists for this vendor"});
        }
        const product = await Product.create({        
            vendorId: vendor._id, 
            name: value.name,        
            description: value.description,
            price: value.price,
            categoryId: value.categoryId,
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});     
    }
}

//list products by vendor
productCtlr.listByVendor = async (req, res) => {
    try{
        const userId = req.userId;
        const vendor = await Vendor.findOne({userId});
        if(!vendor || !vendor.isApproved){
            return res.status(403).json({message: "Vendor profile not found or not approved"});
        }
        const products = await Product.find({vendorId: vendor._id}).populate('categoryId', 'name').populate('vendorId', 'shopName');
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//public List for customers
productCtlr.publicList = async (req, res) => {
    try{
        const products = await Product.find().populate('categoryId', 'name').populate('vendorId', 'shopName');
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }   
}

//update product
productCtlr.update = async (req, res) => {
    const id = req.params.id;
    try{
        const body = req.body;
        const userId = req.userId;
        const {error, value} = productValidationSchema.validate(body, {abortEarly: false});     
        if(error){
            return res.status(400).json({error: error.details});
        }   
        const vendor = await Vendor.findOne({userId});
        if(!vendor || !vendor.isApproved){
            return res.status(403).json({message: "Vendor profile not found or not approved"});
        }
        const product = await Product.findOneAndUpdate({ _id: id, vendorId: vendor._id }, value, { new: true, runValidators: true });
        if(!product){
            return res.status(404).json({message: "Product not found or you are not authorized to update"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
//delete product
productCtlr.remove = async (req, res) => {
    const id = req.params.id;   
    try{
        const userId = req.userId;
        const vendor = await Vendor.findOne({userId});      
        if(!vendor || !vendor.isApproved){
            return res.status(403).json({message: "Vendor profile not found or not approved"});
        }   
        const product = await Product.findOneAndDelete({ _id: id, vendorId: vendor._id });                      
        if(!product){       
            return res.status(404).json({message: "Product not found or you are not authorized to delete"});
        }   
        res.json({message: "Product deleted successfully"});
    }   
    catch (error) {     
        res.status(500).json({message: error.message});     
    }   
}


module.exports = productCtlr;