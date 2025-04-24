const passport = require("passport");
const {userModel} = require("../models/user");

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env. GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
 async function(accessToken, refreshToken, profile, cb) {
   try{
   let user = await userModel.findOne({email: profile.emails[0].value});
    if(!user){
       user =  new userModel({
            name:profile.displayName,
            email:profile.emails[0].value
        });
        await user.save();
        cb(null,user);
    }else{
        cb(null,user);
    }
   }catch(err){
    cb(err,false);
   }
  }
));

passport.serializeUser((user,cb)=>{
    return cb(null,user._id);
})

passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });

module.exports = passport;