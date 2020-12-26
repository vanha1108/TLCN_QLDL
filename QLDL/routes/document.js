var express = require("express");
var router = express.Router();
var multer = require("multer");

const doccumentController = require("./../controllers/document");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router
  .route("/upload")
  .post(upload.single("filedoc"), doccumentController.uploadDocument);

router
  .route("/save")
  .post(upload.single("filedoc"), doccumentController.saveDuplicate);

router.route("/all").get(doccumentController.getAllDocument);

router.route("/search").post(doccumentController.searchDocument);

router.route("/dowload/:iddowload").get(doccumentController.dowloadDocument);

router.route("/delete/:iddelete").delete(doccumentController.deleteDocument);

router
  .route("/subject/:idsubject")
  .get(doccumentController.getDocumentWithSubject);

module.exports = router;
