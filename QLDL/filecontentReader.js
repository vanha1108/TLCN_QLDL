var fs = require("fs");
var formidable = require("formidable");
var PdfReader = require("pdfreader").PdfReader;
var filereader = require("./filereader");
var XLSX = require("xlsx");
const path = require("path");

//module.exports =
module.exports.readFilesHandler = function (filepath) {
  let ext = filereader.getFileExtension(filepath);
  if (ext == ".docx") {
    filereader.extract(filepath).then(function (res, err) {
      if (err) {
        console.log(err);
      }
      var content = res;
      return content;
    });
  } else {
    if (ext == ".txt") {
      fs.readFile(filepath, "utf8", function (err, data) {
        if (err) console.log(err);
        var content = data;
        return content;
      });
    }
  }
};
