var express = require("express");
var router = express.Router();
var docmodel = require("./../model/document");
var file = require("./../document/readfile");
var multer = require("multer");
var fs = require("fs");
var PdfReader = require("pdfreader").PdfReader;
var filereader = require("./../document/filereader");
var checkDup = require("./../handling_data/checkduplicate");
var special = require("./../handling_data/special_chars");
var tfidf = require("./../handling_data/compute_TFIDF");
var vector = require("./../handling_data/vector");
var warehouse = require("./../model/warehouse");
var sw = require("./../handling_data/stopword");
var euclid = require("./../handling_data/euclid");
const { route } = require("./auth");
const pdfParse = require("pdf-parse");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });
const LIMIT = 0.2;

/* GET upload file. */
router.get("/upload", function (req, res, next) {
  res.render("upload", {
    title: "Upload Document",
  });
});

/* POST upload file */
router.post(
  "/upload",
  upload.single("filedoc"),
  async function (req, res, next) {
    // read file
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
        var buff = fs.readFileSync(req.file.path);
        var data = await pdfParse(buff);
        content = data.text;
        break;
    }
    console.log(content);
    // Create vector
    var all_text = [];
    warehouse.findOne({}).exec(async function (err, t) {
      if (err) console.log(err);
      if (t) {
        for (let doc in t.allText) {
          all_text.push(t.allText[doc]);
        }
      }
      var text = special.clear_special_chars(content);
      text = ("" + text).split(" ");
      text = sw.filter_stopword(text);
      all_text.push(text);

      var vecA = await vector.create_vector(text, all_text);

      // Lấy ra từng document trong db và so sánh với document vừa được upload
      docmodel.find({}).exec(async function (err, docs) {
        if (err) console.log(err);

        if (docs.length == 0) {
          // Không có document trong db --> lưu vào db mà k cần check duplicate

          var dt = new docmodel();
          var id = parseInt(req.body.idDoc);
          // Kiểm tra xem idDoc đã có chưa
          var arrID = [];
          for (doc in docs) {
            arrID.push(docs[doc].idDoc);
          }
          while (arrID.indexOf(id) != -1) {
            id += 1;
          }
          dt.idDoc = id;
          var name = req.file.originalname;
          var index = name.lastIndexOf(".");
          var preName = name.slice(0, index);
          var extension = filereader.getFileExtension(req.file.originalname);

          // Kiểm tra tên file đã có chưa
          var arrFilename = [];
          for (let doc in docs) {
            arrFilename.push(docs[doc].filename);
          }
          let j = 1;
          while (arrFilename.indexOf(name) != -1) {
            name = preName + "(" + j + ")" + extension;
            j += 1;
          }
          dt.filename = name;

          dt.path = req.file.path;
          dt.authorname = req.body.authorname;
          dt.note = req.body.note;
          dt.data = content;

          for (let word in vecA) {
            dt.vector.direction.push(word);
            dt.vector.value.push(vecA[word]);
          }
          dt.save();
        } else {
          // Nếu có document trong db thì lấy ra vector của document để so sánh với vector vừa upload
          var result = [];
          for (let doc in docs) {
            var vecB = [];
            var direc = docs[doc].vector.direction;
            var value = docs[doc].vector.value;

            for (let i = 0; i < direc.length; i++) {
              vecB[direc[i]] = value[i];
            }

            var distance = euclid.compute_distance(vecA, vecB);

            if (distance < 0.03) {
              result[docs[doc]._id] = distance;
            }
          }
          var count = 0;
          for (let r in result) {
            count += 1;
          }

          // Nếu không có tài liệu nào gần giống
          if (count <= 0) {
            console.log("Không có tài liệu gần giống");
            var dt = new docmodel();
            var id = parseInt(req.body.idDoc);

            // Kiểm tra xem idDoc đã có chưa
            var arrID = [];
            for (let doc in docs) {
              arrID.push(docs[doc].idDoc);
            }

            while (arrID.indexOf(id) != -1) {
              id += 1;
            }
            dt.idDoc = id;
            var name = req.file.originalname;
            var index = name.lastIndexOf(".");
            var preName = name.slice(0, index);
            var extension = filereader.getFileExtension(req.file.originalname);

            // Kiểm tra tên file đã có chưa
            var arrFilename = [];
            for (let doc in docs) {
              arrFilename.push(docs[doc].filename);
            }
            let j = 1;
            while (arrFilename.indexOf(name) != -1) {
              name = preName + "(" + j + ")" + extension;
              j += 1;
            }
            dt.filename = name;
            dt.path = req.file.path;
            dt.authorname = req.body.authorname;
            dt.note = req.body.note;
            dt.data = content;
            for (let word in vecA) {
              dt.vector.direction.push(word);
              dt.vector.value.push(vecA[word]);
            }
            dt.save();
            result = [];
          } else {
            // Nếu có tài liệu gần giống ( _id tài liệu gần giống chứa trong result)
            var arrcomment = [];
            var d;
            for (let r in result) {
              for (let doc in docs) {
                var s = String(docs[doc]._id);
                if (("" + r).indexOf(s) != -1 && result[r] <= 0) {
                  d = {
                    document: docs[doc].filename,
                    message: "Gần như hoàn toàn giống nhau",
                  };
                  arrcomment.push(d);
                } else {
                  if (("" + r).indexOf(s) != -1 && result[r] < 0.01) {
                    d = {
                      document: docs[doc].filename,
                      message: "Rất giống nhau",
                    };
                    arrcomment.push(d);
                  } else {
                    if (("" + r).indexOf(s) != -1 && result[r] < 0.02) {
                      d = {
                        document: docs[doc].filename,
                        message: "Giống nhau",
                      };
                      arrcomment.push(d);
                    } else {
                      if (("" + r).indexOf(s) != -1) {
                        d = {
                          document: docs[doc].filename,
                          message: "Gần Giống nhau",
                        };
                        arrcomment.push(d);
                      }
                    }
                  }
                }
              }
            }
            //console.log(result);
            //console.log(arrcomment);
            // Danh sách giống nhau:      arrcomment
          }
        }
      });
    });
    res.redirect("/api/doc/upload");
  }
);

/* GET list file. */
router.get("/listall", function (req, res, next) {
  docmodel.find(function (err, listdoc) {
    if (err) handleError();

    res.render("listall", { title: "List Document", listdoc: listdoc });
  });
});

router.get("/search", function (req, res, next) {
  res.render("search", { title: "Search", data: "" });
});

router.post("/search", function (req, res, next) {
  docmodel.search(req.body.key, function (err, dt) {
    res.render("search", { title: "Search", data: dt });
  });
});

router.get("/dowload:idDowload", function (req, res, next) {
  var id = req.params.idDowload;
  docmodel.findOne({ idDoc: id }).exec(function (err, doc) {
    if (err) console.log(err);
    if (!doc) console.log("Not Find");
    res.download(doc.path);
  });
});

router.get("/delete/:idDelete", function (req, res, next) {
  var iddelete = req.params.iddelete;
  docmodel.findByIdAndRemove({ idDoc: iddelete }, function (err, data) {
    if (err) handleError();
    res.redirect("/listall");
  });
});

module.exports = router;
