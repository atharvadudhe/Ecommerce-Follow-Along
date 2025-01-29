const express = require('express')
const mongoose = require('mongoose')
const User = require("../model/user")
const Product=require("../model/product")
const router = express.Router()
const { pupload } = require('../multer')

const validateProductData = (data) => {
    const errors = [];
    if(!data.name) errors.push("Product Name is Required!")
    if(!data.description) errors.push("Product Description is Required!")
    if(!data.price || data.price < 0 || isNaN(data.price) ) errors.push("Product Price is Required!")
    if(!data.stock || data.stock < 0 || isNaN(data.stock) ) errors.push("Product Stock is Required!")
    if(!data.category) errors.push("Product Category is Required!")
    if(!data.email) errors.push("Email is Required!")

    return errors;
}

router.post('./create-product',pupload.array('images',10),async(req,res) => {
    console.log("Hello")
    const {name, description, category, tags, price, stock, email} = req.body;
    const images=req.files.map((file)=>file.path)
    const validationErrors = validateProductData({name,description,category,tags,price,stock,email})
    if(validationErrors.length > 0){
        return res.status(400).json({errors:validationErrors})
    }
    if(images.length === 0){
        return res.status(400).json({errors:"At least one image is needed"})
    }
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"Email does not exists"})
        }
        const newProduct = new Product({
            name,
            description,
            category,
            tags,
            price,
            stock,
            email,
            images,
        });
        await newProduct.save()
        res.status(201).json({
            message:"Product Created Successfully",
            product:newProduct,
        })
    } catch(err){
        console.log(err)
        res.status(500).json({
            error:"Server Error, Could not create a product for you!",
        })
    }
})

module.exports = router;