const express = require("express")
const router = express.Router()
const {paymentModel}= require("../models/payment");
const Razorpay = require("razorpay");

require("dotenv").config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create/orderId', async (req, res) => {
    const options = {
      amount: 5000 * 100, // amount in smallest currency unit
      currency: "INR",
    };
    try {
      const order = await razorpay.orders.create(options);
      
      const newPayment = await paymentModel.create({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'pending',
      });
      res.send(order);
  
    } catch (error) {
      res.status(500)
    }
});

  
router.post('/api/payment/verify', async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET
    try {
      const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js')
  
      const result = validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
      if (result) {
        const payment = await paymentModel.findOne({ orderId: razorpayOrderId , status: "pending"});
        if (!payment) return res.status(404).send("Payment record not found");
        payment.paymentId= razorpayPaymentId;
        payment.signature = signature;
        payment.status = 'completed';
        await payment.save();
        res.json({ status: 'success' });
      } else {
        res.status(400).send('Invalid signature');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Error verifying payment');
    }
  });

  module.exports = router;