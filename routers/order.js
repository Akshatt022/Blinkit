const express = require("express");
const {paymentModel} = require("../models/payment")
const {orderModel} = require("../models/order");
const {cartModel} = require("../models/cart")
const router = express.Router();

router.get('/:userId/:orderid/:paymentid/:signature', async (req,res)=>{
   let {orderid,paymentid,signature,userId} = req.params
   let paymentDetails  = await paymentModel.findOne({
    orderId : orderid,
   })

   if(!paymentDetails) return res.send("Sorry, Payment failed");
   if(req.params.signature === paymentDetails.signature && req.params.paymentid === paymentDetails.paymentId){
   let cart = await cartModel.findOne({user:userId});
   const ordermodel = await orderModel.create({
      orderId: orderid,
      user:userId,
      products: cart.products,
      totalPrice: cart.totalprice,
      status:"Processing",
      payment: paymentDetails._id
   })
    res.redirect(`/map/${req.params.orderid}`);
   }else{
    res.send("Invalid Order");
   }
})

router.post("/address/:orderid",async function(req,res){
   let order = await orderModel.findOne({ orderId: req.params.orderid });
   if( !order) return res.send("Sorry, this order does not exits");
   if(!req.body.address) return res.send("You must Provide an address.");
   order.address = req.body.address;
   order.save();
   res.redirect('/');
})

module.exports = router;