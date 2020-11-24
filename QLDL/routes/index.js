var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var filereader = require("../filereader");
var docmodel = require("../model/document");
var filecontentReader = require("../filecontentReader");
const { Console } = require("console");
const { resolveSoa } = require("dns");
const passport = require("passport");
var flash = require("connect-flash");
const { request } = require("http");
var PdfReader = require("pdfreader").PdfReader;
const User = require("../model/user");
var bcrypt = require("bcrypt-nodejs");

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

// router.post(
//   "/signup",
//   passport.authenticate("local-signup", {
//     successRedirect: "/login", // chuyển hướng tới trang đăng nhập sau khi đăng ký
//     failureRedirect: "/signup", // trở lại trang đăng ký nếu có lỗi
//     failureFlash: true, // allow flash messages
//   })
// );

// router.post(
//   "/login",
//   passport.authenticate("local-login", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// /* Handle Logout */
// router.get("/signout", function (req, res) {
//   req.logout();
//   res.redirect("/");
// });

// router.post("/register", async function (req, res, next) {
//   const checkEmailExist = await User.findOne({ email: req.body.email });

//   if (checkEmailExist) return res.status(422).send("Email is exist");

//   const hashPassword = bcrypt.hashSync(
//     req.body.password,
//     bcrypt.genSaltSync(10),
//     null
//   );
//   const newUser = new User();
//   newUser.email = req.body.email;
//   newUser.password = hashPassword;
//   newUser.role = req.body.role;

//   newUser.save(function (err) {
//     if (err) throw err;
//     return res.send(newUser);
//   });
// });

module.exports = router;
