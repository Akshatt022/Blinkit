const express = require('express');
const router = express.Router();
const { productModel,validateProduct } = require("../models/product");
const {categoryModel} = require("../models/category");
const {cartModel , validateCart} = require("../models/cart");
const upload = require("../config/multer_config");
const {validateAdmin , isLoggedIn} = require("../middleware/admin");

router.get("/",isLoggedIn,async function(req,res){
      let somethingInCart = false;
      const result = await productModel.aggregate([
            {
              $group: {
                _id: "$category",
                products: { $push: "$$ROOT" } // Collect all products in an array
              }
            },
            {
              $project: {
                _id: 0,
                category: "$_id",
                products: { $slice: ["$products", 10] } // Get only the first 10 products
              }
            }
          ]);

      let cart = await cartModel.findOne({ user: req.session.passport.user });
      if(cart && cart.products.length > 0) somethingInCart = true; 
      

      let rnproducts = await productModel.aggregate([{ $sample:{size:3}}]);

      const resultobject = result.reduce((acc,item) =>{
           acc[item.category] = item.products;
           return acc;
      },{})
    
      res.render("index",{
        products: resultobject,
        rnproducts, 
        somethingInCart,
        cartCount: cart?cart.products.length : 0,

      });
})
router.get("/delete/:id",validateAdmin,async function(req,res){
    if(req.user.admin){
    let prods = await productModel.findOneAndDelete({_id:req.params.id});
    return res.redirect("/admin/products");
    }
    res.send("You are not allowed to delete this.");
})
router.post("/delete",validateAdmin,async function(req,res){
    if(req.user.admin){
    let prods = await productModel.findOneAndDelete({_id:req.body.product_id});
    return res.redirect("back");
    }
    res.send("You are not allowed to delete this.");
})
router.get("/update/:id",validateAdmin,async function(req,res){
    if(req.user.admin){
    let prods = await productModel.findOneAndUpdate({_id:req.params.id});
    return res.redirect("/admin/products");
    }
    res.send("You are not allowed to delete this.");
})

router.post("/",upload.single("image"),async function(req,res){
    let{name,price,category,stock,description,image} = req.body;
    let {error} = validateProduct({
        name,
        price,
        category,
        stock,
        description,
        image
    })
   
    if(error) return res.send(error.message);
    
    let iscategory = await categoryModel.findOne({name:category});
    if(!iscategory) {
        await categoryModel.create({name: category});
    } 
    
    let product =  await productModel.create({
        name,
        price,
        category,
        stock,
        description,
        image: req.file.buffer,
    })
    res.redirect('/admin/dashboard');
})

module.exports = router;