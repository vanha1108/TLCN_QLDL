var filereader = require("./filereader");
var fs = require("fs");
var PdfReader = require("pdfreader").PdfReader;

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

module.exports.readFilepdf = async function (filepath) {
  return new Promise(async function (resolve, reject) {
    var content = "";
    await fs.readFile(filepath, "utf-8", async function (err, data) {
      await new PdfReader().parseBuffer(data, function (err, item) {
        if (err) console.log("1" + err);
        else if (!item) console.log(item);
        else if (item.text) {
          content = content + " " + item.text;
        }
        resolve(content);
      });
    });
  });
};
