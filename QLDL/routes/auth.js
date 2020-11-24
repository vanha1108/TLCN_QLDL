var express = require("express");
var router = express.Router();
var flash = require("connect-flash");
const User = require("../model/user");
var bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});

router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register" });
});

router.post("/register", async function (req, res, next) {
  const checkEmailExist = await User.findOne({ email: req.body.email });

  if (checkEmailExist) return res.status(422).send("Email is exist");

  const hashPassword = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10),
    null
  );
  const newUser = new User();
  newUser.email = req.body.email;
  newUser.password = hashPassword;
  newUser.role = req.body.role;

  newUser.save(function (err) {
    if (err) throw err;
    return res.render("/api/auth/login", { title: "Login" });
  });
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(422).send("Email or Password is not correct");

  const checkPassword = bcrypt.compareSync(req.body.password, user.password);

  if (!checkPassword)
    return res.status(422).send("Email or Password is not correct");

  const token = jwt.sign({ _id: user._id }, "secrettlcn", {
    expiresIn: 60 * 60 * 24,
  });
  res.header("auth-token", token).send(token);
});

module.exports = router;
