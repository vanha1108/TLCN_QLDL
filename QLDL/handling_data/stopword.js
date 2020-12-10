const sw = require("stopword");
var fs = require("fs");

module.exports.filter_stopword = function (text) {
  text = ("" + text).split(" ");
  var word = fs.readFileSync(
    "D:/nodejs/QLDL/handling_data/stop_word_vn.txt",
    "utf-8"
  );
  word = word.split("\n");
  var output = sw.removeStopwords(text, word);
  output = ("" + output).replace(/[,]/g, " ");
  return output;
};
