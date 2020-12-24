var express = require("express");
var router = express.Router();

const themeController = require("./../controllers/theme");

router.route("/addtheme").post(themeController.addTheme);

router.route("/alltheme").get(themeController.getAllTheme);

router.route("/deletetheme/:idDelete").delete(themeController.deleteTheme);

router.route("/edit/:idEdit").put(themeController.editTheme);

module.exports = router;
