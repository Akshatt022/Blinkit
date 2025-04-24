const mongoose = require('mongoose');
const Joi = require('joi');

const OrderSchema = new mongoose.Schema({
    orderId:{
        type:String,
        require:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000
    },
    address: {
        type: String,
        maxlength: 200
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",

    }
}, { timestamps: true });

const orderJoiSchema = Joi.object({
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string()).min(1).required(),
    totalPrice: Joi.number().min(0).max(1000000).required(),
    address: Joi.string().min(10).max(200).required(),
    status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').default('Pending'),
    payment: Joi.string().required(),
    delivery: Joi.string().required()
});

const validateOrder = (order) => {
    return orderJoiSchema.validate(order);
};

const orderModel = mongoose.model('order', OrderSchema);

module.exports = {
    orderModel,
    validateOrder
};