const e = require("express");
var express = require("express");
var router = express.Router();
var thememodel = require("./../model/theme");
const { route } = require("./auth");

var message;

router.get("/createtheme", function (req, res, next) {
  res.send("theme", { tiltle: "Theme", message: message });
});

router.post("/createtheme", function (req, res, next) {
  var subjectName = req.body.name;
  message = "";
  thememodel.findOne({ name: subjectName }).exec(function (err, data) {
    if (err) console.log(err);
    if (data) {
      message = "Theme name already exists!";
    } else {
      var data = new thememodel();
      data.name = req.body.name;
      data.listidDoc = [];
      data.save();
    }
  });
  //res.redirect("/api/theme/listtheme");
});

router.get("/listall", function (req, res, next) {
  thememodel.find(function (err, listtheme) {
    if (err) handleError();

    res.send(listtheme);
  });
});

router.get("/deletetheme/:idDelete", function (req, res, next) {
  var idDelete = req.params.idDelete;
  message = "";
  thememodel.findOne({ _id: idDelete }).exec(function (err, data) {
    if (err) console.log(err);
    if (data) {
      if (data.listidDoc.length != 0) {
        message = "Theme cannot be deleted";
      } else {
        thememodel.findByIdAndRemove({ _id: idDelete }, function (err, de) {
          if (err) handleError();
        });
      }
    }
  });
  //res.redirect("/api/theme/listtheme");
});

router.get("/edit/:idEdit", function (req, res, next) {
  var idEdit = req.params.idEdit;
  thememodel.findOne({ _id: idEdit }).exec(function (err, data) {
    var newName = req.body.newName;
    thememodel.findOne({ name: newName }, function (err, re) {
      if (re) {
        message = "Theme name already exists";
      } else {
        var dt = new thememodel();
        dt.name = newName;
        dt.save();
      }
    });
  });
  //res.redirect("/api/theme/listtheme");
});

module.exports = router;
