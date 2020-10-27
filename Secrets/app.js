require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')


const app = express();
const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: "Ankit is here!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser:true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String
});


const secret = process.env.SECRET;

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// userSchema.plugin(encrypt, {secret:secret, encryptedFeilds: ['password']});

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// Got error Failed to serialize user so used the code from passport docs

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/", function(req, res){
    res.render("home");
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
  });

app.get("/secrets", function(req, res){
    if(req.isAuthenticated()){
        // console.log(req);
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){

    // var password = md5(req.body.password);

    // User.findOne({email: req.body.username}, function(err, foundUser){
    //     if(err) {
    //         console.log(err);
    //     } else if(foundUser) {
    //         bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
    //         if(result===true) {
    //             res.render("secrets");
    //         } else {
    //             res.send("Nikal Laude")
    //         }
    //         });
    //     }
    // });

    const user = new User({
        username: req.body.password,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    })

});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){


    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    
    //     if(err) {
    //         console.log(err);            
    //     } else {
    //         newUser = new User({email: req.body.username, password: hash}); //md5(req.body.password)

    //         newUser.save(function(err){
    //             if(!err){
    //                 res.render("secrets");
    //             } else {
    //                 console.log(er);
    //             }
    //         });
    //     }
    // });


    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });


});

app.listen(3000, function(){
    console.log("Server is running at port 3000");
});