const express = require("express");
const route = express.Router();


route.get("/login",(req,res) => {
   res.render("user_login");
})
route.get("/profile",(req,res)=>{
   res.send("profile page");
})
route.get("/logout",(req,res) => {
   req.logout(function( err){
      if(err){
         return next(err);
      }
      req.session.destroy((err) => {
         if(err) return next(err);
         res.clearCookie("connect.sid");
         res.redirect("/users/login");
      })
   })
})

module.exports = route;