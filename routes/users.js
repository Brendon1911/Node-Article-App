const express = require("express"),
      router = express.Router(),
      bcrypt = require("bcryptjs"),
      passport = require("passport");

// Bring in User Model
const User = require("../models/user");

// Register Form
router.get("/register", (req, res) => {
  res.render("register");
});

//Register Process
router.post("/register", (req, res) => {
  const name = req.body.name,
        email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        password2 = req.body.password2;

  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("password2", "Passwords do not match").equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
      
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err)
        }
        newUser.password = hash;
        newUser.save((err) => {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("success", "You are now registered and can now log in");
            res.redirect("/users/login");
          }
        });
      });
    });
  }
});

// Login Form
router.get("/login", (req, res) => {
  res.render("login");
});

// Login Process
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged you out");
  res.redirect("/users/login");
});

module.exports = router;