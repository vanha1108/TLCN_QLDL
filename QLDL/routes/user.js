var express = require("express");
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

router.route("/edit/:idedit").put(userController.editUser);

router.route("/current").get(userController.getUserCurrent);

module.exports = router;
