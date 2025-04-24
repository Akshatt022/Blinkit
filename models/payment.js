const mongoose = require('mongoose');
const Joi = require('joi');

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
}, { timestamps: true });

const paymentModel = mongoose.model('payment', PaymentSchema);

function validatePayment(data) {
    const schema = Joi.object({
        orderId: Joi.string().required(),
        paymentId: Joi.string().optional(),
        signature: Joi.string().optional(),
        amount: Joi.number().required(),
        currency: Joi.string().required(),
        status: Joi.string().valid('pending', 'completed').optional()
    });
    return schema.validate(data);
}

module.exports = {
    paymentModel,
    validatePayment,
};
