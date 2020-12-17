var express = require("express");
var router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user");

router.route("/register").post(userController.signUp);

router.route("/login").post(passport.authenticate("local-login"));

router.route("/changepass").post(userController.changePassword);

router.route("/logout").get(userController.logOut);

module.exports = router;
