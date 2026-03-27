const Category = require("../models/category-model");
const Vendor = require("../models/vendor-model");
const cloudinary = require("../middlewares/cloudinary");
const fs = require("fs");
const categoryValidationSchema = require("../validations/category-validation");
const categoryCtlr = {};        
//creating category
categoryCtlr.create = async (req, res) => {
    try{    
        const body = req.body;
        const userId = req.userId;     
        const {error, value} = categoryValidationSchema.validate(body, {abortEarly: false});
        if(error){
            return res.status(400).json({error: error.details});
        }   
        const vendor = await Vendor.findOne({userId});
        if(!vendor){
            return res.status(404).json({error: "Vendor profile not found"});
        }  
        if(!vendor.isApproved){
            return res.status(403).json({error: "Your vendor account is not approved yet"});
        }     
        const existingCategory = await Category.findOne({name: value.name, vendorId: vendor._id});
        if(existingCategory){
            return res.status(400).json({error: "Category with this name already exists"});
        }   
        let image = "";
        let publicId = "";
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'categories'
        });
        fs.unlinkSync(req.file.path); 
        image = result.secure_url;
        publicId = result.public_id;
        }  
        
        const category = await Category.create({        
            name: value.name,     
            image: image,
            publicId: publicId,
            vendorId: vendor._id
        }); 
        res.status(201).json(category); 
    }catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

categoryCtlr.list = async (req, res) => {
    try{
        const vendor = await Vendor.findOne({userId: req.userId});
        if(!vendor){
            return res.status(404).json({error: "Vendor profile not found"});
        }   
        const categories = await Category.find({vendorId: vendor._id}).populate('vendorId', 'shopName') ;
        res.json(categories);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }       
}

categoryCtlr.publicList = async (req, res) => {
    try{
        const vendorId = req.params.vendorId;
        const categories = await Category.find({vendorId}).populate('vendorId', 'shopName') ;
        res.json(categories);
    }   
    catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }   
}

categoryCtlr.update = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor profile not found" });
    }
    const existingCategory = await Category.findOne({
      _id: id,
      vendorId: vendor._id
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: "Category not found or you are not authorized to update"
      });
    }

    // 👇 STEP 2: If new image uploaded → delete old image from Cloudinary
    if (req.file) {
      if (existingCategory.publicId) {
        await cloudinary.uploader.destroy(existingCategory.publicId);
      }

      // 👇 STEP 3: Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories"
      });

      fs.unlinkSync(req.file.path);

      // Add new image URL & publicId to body BEFORE validation
      body.image = result.secure_url;
      body.publicId = result.public_id;
    }

    // Validate name and image
    const { error, value } = categoryValidationSchema.validate(body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    // 👇 STEP 4: Update category
    const category = await Category.findOneAndUpdate(
      { _id: id, vendorId: vendor._id },
      value,
      { new: true }
    ).populate("vendorId", "shopName");

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

categoryCtlr.remove = async (req, res) => {
  try {
    const id = req.params.id;

    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor profile not found" });
    }

    // STEP 1: Find category before deleting (to get publicId)
    const category = await Category.findOne({
      _id: id,
      vendorId: vendor._id
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found or you are not authorized to delete"
      });
    }

    // STEP 2: Delete Cloudinary image if exists
    if (category.publicId) {
      await cloudinary.uploader.destroy(category.publicId);
    }

    // STEP 3: Delete category from DB
    await Category.findOneAndDelete({
      _id: id,
      vendorId: vendor._id
    });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = categoryCtlr;