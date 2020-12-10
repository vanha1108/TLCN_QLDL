"use strict";

var fs = require("fs");
var path = require("path");

var words = fs.readFileSync(path.join(__dirname, "./stop_word_vn.txt"), "utf8");
var text = "à ừ đây là vấn đề chính của câu chuyện";

module.exports = words
  .split("\n")
  .map(function (word) {
    return (word || "").trim();
  })
  .filter(function (word) {
    return word !== false && word.length > 0;
  });
