const sw = require("stopword");
var fs = require("fs");
const path = require('path');

module.exports.filter_stopword = function (text) {
  text = ("" + text).split(" ");
  var word = fs.readFileSync(
    path.join(__dirname, "./stop_word_vn.txt"),
    "utf8"
  );
  word = word.split("\n");
  var output = sw.removeStopwords(text, word);
  output = ("" + output).replace(/[,]/g, " ");
  return output;
};
