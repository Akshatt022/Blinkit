const mongoose = require('mongoose');
const Joi = require('joi');

const DeliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    trackingURL: {
        type: String,
    },
    estimatedDeliveryTime: {
        type: Number,
        min: 0,
        max: 168 // Maximum 7 days in hours
    }
}, { timestamps: true });

const deliveryJoiSchema = Joi.object({
    order: Joi.string().required(),
    deliveryBoy: Joi.string().min(2).max(50).required(),
    status: Joi.string().valid('Pending', 'In Transit', 'Delivered', 'Cancelled').default('Pending'),
    trackingURL: Joi.string().uri(),
    estimatedDeliveryTime: Joi.number().min(0).max(168).optional()
});

const validateDelivery = (delivery) => {
    return deliveryJoiSchema.validate(delivery);
};

const deliveryModel = mongoose.model('delivery', DeliverySchema);

module.exports = {
    deliveryModel,
    validateDelivery
};