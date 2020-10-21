var express = require('express');
var router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var filereader = require('../filereader');
var doc = require('../model/document');
var filecontentReader = require('../filecontentReader');
const { Console } = require('console');
const { resolveSoa } = require('dns');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
var filecontent = "";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET upload file. */
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload Document'});
});

// /* POST upload file. */
// router.post('/upload', upload.single('filedoc'), function(req, res, next) {
//   filereader.extract(req.file.path).then(function (res, err) {
//     if (err) { console.log(err); }
//     filecontent = res;
//     console.log("DL: " + filecontent);
//     var temp = {
//       "filename": req.file.originalname,
//       "authorname": req.body.authorname,
//       "note": req.body.note,
//       "data": filecontent
//     }
//     var dulieu = new doc(temp);
//     dulieu.save();
//   })
//   res.redirect('/upload');
// });

// router.post('/upload', async(req, res, next) => {
//   // Đường dẫn: req.file.path
//   var a = await filecontentReader.filecontentReader(req, res);
  
// });


router.post('/upload', function(req, res, next) {
  filecontentReader(req, res);

  res.redirect('/upload');
});



module.exports = router;
