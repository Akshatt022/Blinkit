const express = require("express");
const{ validateAdmin} = require("../middleware/admin");
const {categoryModel,validateCategory} = require("../models/category");
const router = express.Router();

router.post("/create",validateAdmin,async(req,res)=>{
    let category = await categoryModel.create({
        name: req.body.category,
    })
    res.redirect()
})

module.exports = router;