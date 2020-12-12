var filereader = require("./filereader");
var fs = require("fs");
var PdfReader = require("pdfreader").PdfReader;
const pdfParse = require("pdf-parse");

module.exports.readFiletxt = async function (filepath) {
  const data = fs.readFileSync(filepath, { encoding: "utf8", flag: "r" });
  return data;
};

module.exports.readFiledocx = async function (filepath) {
  return new Promise(function (resolve, reject) {
    filereader.open(filepath).then(function (res, err) {
      if (err) {
        reject(err);
      }
      var body = "";
      var components = res.toString().split("<w:t");
      for (var i = 0; i < components.length; i++) {
        var tags = components[i].split(">");
        var content = tags[1].replace(/<.*$/, "");
        body += content + " ";
      }
      resolve(body);
    });
  });
};
