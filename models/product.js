const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Product Schema
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000,
       
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        max: 10000,
    },
    description: {
        type: String,
    },
    image: {
        type: Buffer,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

// Joi Validation Schema
const productJoiSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Product name must be at least 2 characters long',
            'string.max': 'Product name cannot exceed 100 characters'
        }),
    
    price: Joi.number()
        .min(0)
        .max(1000000)
        .positive()
        .required()
        .messages({
            'number.min': 'Price cannot be negative',
            'number.max': 'Price is too high',
            'number.positive': 'Price must be a positive number'
        }),
    
    category: Joi.string()
        .required(),
    
    stock: Joi.number()
        .integer()
        .min(0)
        .max(10000)
        .required()
        .messages({
            'number.min': 'Stock cannot be negative',
            'number.max': 'Stock exceeds maximum limit'
        }),
    
    description: Joi.string()
        .optional(),
    
    image: Joi.any().custom((value, helpers) => {
        if (!Buffer.isBuffer(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).optional(),
        
});

// Validation Function
const validateProduct = (product) => {
    return productJoiSchema.validate(product);
};

// Create Mongoose Model
const productModel = mongoose.model('product', ProductSchema);

module.exports = {
    productModel,
    validateProduct
};