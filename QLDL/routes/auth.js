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

module.exports = router;
