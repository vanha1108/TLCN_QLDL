var express = require("express");
var router = express.Router();
const User = require("./../model/user");
const verifyToken = require("./../middlewares/verifyToken");
const user = require("./../model/user");

/* GET users listing. */
router.get("/listuser", verifyToken, function (req, res, next) {
  User.find({}).exec(function (err, users) {
    res.send(users + " \n" + "hhhhhh" + req.user.role);
  });
});

module.exports = router;
