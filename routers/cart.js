const express = require("express");
const router = express.Router();
const { cartModel, validateCart } = require("../models/cart");
const { validateAdmin, isLoggedIn } = require("../middleware/admin");
const { productModel } = require("../models/product");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    let cart = await cartModel
      .findOne({ user: req.session.passport.user })
      .populate("products");

    let DataStructue = {};

    cart.products.forEach((product) => {
      let key = product._id.toString();
      if (DataStructue[key]) {
        DataStructue[key].quantity += 1;
      } else {
        DataStructue[key] = {
          ...product._doc,
          quantity: 1,
        };
      }
    });

    let finalarray = Object.values(DataStructue);
    let deliverycharge = cart.totalprice == 0 ? 0 : 20;
    let handlingcharge = cart.totalprice == 0 ? 0 : 4;
    let devcharge = cart.totalprice == 0 ? 0 : 4;
    let finalprice = cart.totalprice;
    let tfinalprice = cart.totalprice;
    res.render("cart", {
      cart: finalarray,
      tfinalprice,
      finalprice: finalprice + deliverycharge + handlingcharge + devcharge,
      deliverycharge,
      handlingcharge,
      devcharge,
      userId: req.session.passport.user,
    });
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/add/:id", isLoggedIn, async (req, res) => {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });
    if (!cart) {
      cart = await cartModel.create({
        user: req.session.passport.user,
        products: [req.params.id],
        totalprice: Number(product.price),
      });
    } else {
      cart.products.push(req.params.id);
      cart.totalprice = Number(cart.totalprice) + Number(product.price);

      await cart.save();
    }
    res.redirect("back");
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/remove/:id", isLoggedIn, async (req, res) => {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });
    let index = cart.products.indexOf(req.params.id);
    cart.totalprice = Number(cart.totalprice) - Number(product.price);

    if (index !== -1) cart.products.splice(index, 1);
    else return res.send("item is not available");

    await cart.save();
    res.redirect("back");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
