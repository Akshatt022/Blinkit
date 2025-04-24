const jwt = require("jsonwebtoken");
const passport = require("passport");
const cookieParser = require("cookie-parser");

require("dotenv").config();

async function validateAdmin(req, res, next) {
  try {
    let token = req.cookies?.token;
    if (!token) return res.status(401).send("You need to login first");

    let data = await jwt.verify(token, process.env.JWT_KEY);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token");
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
}


module.exports ={ validateAdmin , isLoggedIn};