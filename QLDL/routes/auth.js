var express = require("express");
var router = express.Router();
var flash = require("connect-flash");
const User = require("../model/user");
var bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register" });
});

router.post(
  "/register",
  passport.authenticate("local-register", {
    successRedirect: "/api/auth/login",
    failureRedirect: "/api/auth/register",
    failureFlash: true,
  })
);

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/api/users/listuser",
    failureRedirect: "/api/auth/login",
    failureFlash: true,
  })
);

router.get("/changepass", function (req, res, next) {
  res.render("changepass", { title: "Change Password" });
});

router.post("/changepass", function (req, res, next) {
  User.findOne({ email: req.body.current }, function (err, user) {
    if (err) console.log(err);
    if (!user) {
      console.log("NULL");
      res.render("changepass", { title: "Change Password" });
      return;
    }
    var checkPass = bcrypt.compareSync(req.body.currentPassword, user.password);
    if (!checkPass) res.redirect("/api/auth/changepass");
    else {
      var passwordHash = bcrypt.hashSync(
        req.body.newPassword,
        bcrypt.genSaltSync(10),
        null
      );
      user.password = passwordHash;
      user.save();
      res.redirect("/api/auth/login");
    }
  });
});

router.get("/logout", function (req, res, next) {
  req.logOut();
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
