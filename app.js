const express = require("express");
const app = express();
const IndexRouter = require("./routers/index");
const AuthRouter = require("./routers/auth");
const AdminRouter = require('./routers/admin');
const productRouter = require("./routers/product");
const categoryRouter = require("./routers/category");
const userRouter = require("./routers/user");
const path = require("path");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cartRouter = require("./routers/cart");
const paymentRouter = require("./routers/payment");
const orderRouter = require("./routers/order");

require("dotenv").config();
require("./config/passport");
require("./config/mongoose");

app.set("view engine","ejs");
        app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressSession({
    resave: false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.use("/",IndexRouter);
app.use("/auth",AuthRouter);
app.use("/admin",AdminRouter);
app.use("/products",productRouter);
app.use("/categories",categoryRouter);
app.use("/users",userRouter);
app.use("/cart",cartRouter);
app.use("/payment",paymentRouter);
app.use("/order",orderRouter);

app.listen(3000);