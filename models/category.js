const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Category schema for Mongoose
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Ensure the name field is mandatory
            minlength: 3, // Minimum length for category name
            maxlength: 50, // Maximum length for category name
            unique: true, // Ensure uniqueness in database (handled at DB level)
            trim: true, // Remove unnecessary whitespace
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Joi validation schema for category input
const schema = Joi.object({
    name: Joi.string()
        .min(3) // Minimum length for category name
        .max(50) // Maximum length for category name
        .trim()
        .required(), // Ensure the name field is mandatory
});

const validateCategory = (category) => {
    return schema.validate(category);
};

// Create and export the model
const categoryModel = mongoose.model('category', categorySchema);

module.exports = {
    categoryModel,
    validateCategory,
};
