var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var filereader = require("../filereader");
var docmodel = require("../model/document");
var filecontentReader = require("../filecontentReader");
const { Console } = require("console");
const { resolveSoa } = require("dns");
var te = require("../test");
var PdfReader = require("pdfreader").PdfReader;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
var filecontent = "";
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET upload file. */
router.get("/upload", function (req, res, next) {
  res.render("upload", { title: "Upload Document" });
});

/* POST upload file */
router.post("/upload", upload.single("filedoc"), function (req, res, next) {
  var content = "";
  let ext = filereader.getFileExtension(req.file.path);
  if (ext == ".docx") {
    filereader.extract(req.file.path).then(function (res, err) {
      if (err) handleError();
      content = res;

      // Tạo đối tượng để thêm vào csdl
      var temp = {
        filename: req.file.originalname,
        authorname: req.body.authorname,
        note: req.body.note,
        data: content,
      };
      // Thêm vào csdl
      var data = new docmodel(temp);
      data.save();
    });
  } else {
    if (ext == ".txt") {
      fs.readFile(req.file.path, "utf8", function (err, data) {
        if (err) handleError();
        content = data;

        // Tạo đối tượng để thêm vào csdl
        var temp = {
          filename: req.file.originalname,
          authorname: req.body.authorname,
          note: req.body.note,
          data: content,
        };
        // Thêm vào csdl
        var data = new doc(temp);
        data.save();
      });
    } else {
      if (ext == ".pdf") {
        fs.readFile(req.file.path, function (err, data) {
          new PdfReader().parseBuffer(data, function (err, item) {
            if (err) console.log(err);
            else if (!item) console.log(item);
            else if (item.text) {
              filecontent = filecontent + " " + item.text;
            }
            console.log("File: " + filecontent);
          });
        });
      }
    }
  }
  res.redirect("/upload");
});

/* GET list file. */
router.get("/listall", function (req, res, next) {
  docmodel.find(function (err, data) {
    if (err) handleError();

    res.render("listall", { title: "List Document", data: data });
  });
});

/* GET delete file. */
router.get("/delete/:iddelete", function (req, res, next) {
  var iddelete = req.params.iddelete;
  docmodel.findByIdAndRemove({ _id: iddelete }, function (err, data) {
    if (err) handleError();
    res.redirect("/listall");
  });
});

module.exports = router;
