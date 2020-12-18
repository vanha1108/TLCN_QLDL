var express = require("express");
const { session } = require("passport");
var router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user");

router.route("/register").post(userController.signUp);

router
  .route("/login")
  .post(
    passport.authenticate("local", { session: false }),
    userController.signIn
  );

router.route("/changepass").post(userController.changePassword);

router.route("/logout").get(userController.logOut);

router.route("/").get(userController.getAllUser);

module.exports = router;
