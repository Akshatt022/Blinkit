const express = require("express");
const router = express.Router();
const {adminModel} = require("../models/admin");
const {productModel} = require("../models/product")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { route } = require(".");
const {validateAdmin }= require("../middleware/admin");
const { categoryModel } = require("../models/category");

require("dotenv").config()

if(typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV == 'development'){
        router.get('/create', async function(req, res) {
            try {
                // Check if an admin already exists
                let existingAdmin = await adminModel.findOne({ email: "admin@blink.com"});
                if (existingAdmin) {
                    return res.status(400).send("Admin already exists.");
                }
        
                let salt = await bcrypt.genSalt(10);
                let hash = await bcrypt.hash("admin", salt);
        
                let user = new adminModel({
                    name: "Akshat Singh",
                    email: "admin@blink.com",
                    password: hash,
                    role: "SuperAdmin"
                });
        
                await user.save();
        
                let token = jwt.sign({ email: "admin@blink.com",admin:true}, process.env.JWT_KEY);
                res.cookie("token", token);
                res.send("Admin Created Successfully");
            } catch (err) {
                console.error("It failed", err.message);
                res.status(500).send("Internal Server Error");
            }
        });         
}


router.get("/login",function(req,res){
    res.render("admin_login");
})
router.post("/login",async function(req,res){
    let{email , password} = req.body;
    let admin  = await adminModel.findOne({email:email});
    if(!admin) return res.send("admin is not available");
    let valid = await bcrypt.compare(password,admin.password);
    if(valid){
        let token = jwt.sign({ email: "admin@blink.com",admin:true }, process.env.JWT_KEY);
        res.cookie("token", token);
        res.redirect('/admin/dashboard');
    }
})
router.get("/dashboard", validateAdmin, async (req,res)=>{
    let countproduct =  await productModel.countDocuments();
    let countcategory =  await categoryModel.countDocuments();
    res.render("admin_dashboard",{categcount:countcategory,prodcount:countproduct});
})
router.get("/products", validateAdmin,async (req,res)=>{
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
      const resultobject = result.reduce((acc,item) =>{
        acc[item.category] = item.products;
        return acc;
      },{})
      
    res.render("admin_products",{products:resultobject});
})
router.get("/logout", validateAdmin,(req,res)=>{
   res.cookie("token","");
   res.redirect("/admin/login");
})
module.exports = router;