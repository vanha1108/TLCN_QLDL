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

router.route("/dowload/:idDowload").get(doccumentController.dowloadDocument);

router.route("/delete/:idDelete").get(doccumentController.deleteDocument);

router.route("/subject").post(doccumentController.getDocumentWithSubject);

module.exports = router;
