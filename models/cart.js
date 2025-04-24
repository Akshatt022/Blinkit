const mongoose = require("mongoose");
const Joi = require("joi");

// Define the Cart schema for Mongoose
const CartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
        ],
        totalprice: {
            type: Number,
            required: true,
            min: 0, // Total price cannot be negative
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Joi validation schema for cart input
const CartJoiSchema = Joi.object({
        user: Joi.string().required(), // ObjectId should be a valid string
        products: Joi.array()
            .items(Joi.string().required()) // Each product must be a valid string (ObjectId)
            .min(1) // At least one product required
            .required(),
        totalprice: Joi.number()
            .min(0) // Total price cannot be negative
            .required(),
});


const validateCart = (data) => {
    return CartJoiSchema.validate(data);
};

const cartModel = mongoose.model("cart", CartSchema);

module.exports = {
    cartModel,
    validateCart,
};
