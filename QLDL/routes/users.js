var express = require("express");
var router = express.Router();
const User = require("./../model/user");
const verifyToken = require("./../middlewares/verifyToken");
const user = require("./../model/user");

/* GET users listing. */
router.get("/listuser", function (req, res, next) {
  if (req.isAuthenticated() && "1" == req.session.passport.user.role) {
    User.find({}).exec(function (err, users) {
      res.send(users);
    });
  } else {
    res.send("Access dined");
  }
});

module.exports = router;
