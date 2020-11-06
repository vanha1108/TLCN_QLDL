var fs = require("fs");
var formidable = require("formidable");
var PdfReader = require("pdfreader").PdfReader;
var filereader = require("./filereader");
var XLSX = require("xlsx");

module.exports.readHandler = readHandler = async (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var filecontent = "";
    fs.readFile(files.file.path, (err, data) => {
      let filePath = files.file.path;
      let filebuffer = data;
      let filename = files.file.name;
      var fileextension = filereader.getFileExtension(filename);
      switch (fileextension) {
        case ".pdf":
          new PdfReader().parseBuffer(filebuffer, function (err, item) {
            if (err) console.log(err);
            else if (!item) console.log(item);
            else if (item.text) {
              filecontent = filecontent + " " + item.text;
            }
          });
          break;
        case ".doc" || ".docx":
          filereader.extract(filePath).then(function (res, err) {
            if (err) {
            }
            filecontent = res;
          });
        case ".xlsx" || ".xls":
          var result = {};
          data = new Uint8Array(data);
          var workbook = XLSX.read(data, {
            type: "array",
          });
          workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              header: 1,
            });
            if (roa.length) result[sheetName] = roa;
          });
          filecontent = JSON.stringify(result);
          break;
        case ".txt" || ".csv":
          filecontent = data;
        default:
          filecontent = filename;
      }
      console.log(`This is file content ==> ${filecontent}`);
    });
  });
};
