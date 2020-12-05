var express = require("express");
var router = express.Router();
var docmodel = require("./../model/document");
var file = require("./../document/readfile");
var multer = require("multer");
var fs = require("fs");
var PdfReader = require("pdfreader").PdfReader;
var filereader = require("./../document/filereader");
var check = require("./../handling_data/checkduplicate");
var special = require("./../handling_data/special_chars");
var tfidf = require("./../handling_data/compute_TFIDF");
const { text } = require("express");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

/* GET upload file. */
router.get("/upload", function (req, res, next) {
  res.render("upload", {
    title: "Upload Document",
    message: req.flash("duplicate"),
  });
});

/* POST upload file */
router.post(
  "/upload",
  upload.single("filedoc"),
  async function (req, res, next) {
    var content = "";
    let ext = filereader.getFileExtension(req.file.path);
    switch (ext) {
      case ".txt":
        content = await file.readFiletxt(req.file.path);
        break;
      case ".docx":
        await file.readFiledocx(req.file.path).then(function (res, err) {
          if (err) console.log(err);
          content = res;
        });
        break;
      case ".pdf":
        await new PdfReader().parseFileItems(
          req.file.path,
          function (err, item) {
            if (item && item.text) {
              content += item.text;
            }
          }
        );
        break;
    }

    var kq;
    docmodel.find({}).exec(async function (err, docs) {
      if (err) console.log(err);
      for (let doc in docs) {
        await check
          .check_duplicate(content, docs[doc].data)
          .then(function (k, err) {
            if (err) console.log(err);
            kq = k;
          });
        if (kq == true) {
          //req.flash("duplicate", "File duplicate!");
          // res.render("upload", {
          //   title: "Upload",
          //   message: req.flash("duplicate"),
          //});
          console.log("Duplicate");
        } else {
          console.log("No Duplicate");
          // File không bị trùng lắp ==> Lưu vào db
          var temp = {
            filename: req.file.originalname,
            authorname: req.body.authorname,
            note: req.body.note,
            data: content,
          };
          // Thêm vào csdl
          var data = new docmodel(temp);
          data.save();
        }
      }
    });
    res.redirect("/api/doc/upload");
  }
);

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
