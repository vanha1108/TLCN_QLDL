var filereader = require("./../document/filereader");
var file = require("./../document/readfile");
var vector = require("./../handling_data/vector");
var sw = require("./../handling_data/stopword");
var docmodel = require("./../model/document");
var warehouse = require("./../model/warehouse");
var thememodel = require("./../model/theme");
var euclid = require("./../handling_data/euclid");
var special = require("./../handling_data/special_chars");
var fs = require("fs");

const readDocument = async (filePath) => {
  var content = "";
  let ext = filereader.getFileExtension(filePath);
  switch (ext) {
    case ".txt":
      content = await file.readFiletxt(filePath);
      break;
    case ".docx":
      await file.readFiledocx(filePath).then(function (res, err) {
        content = res;
      });
      break;
    case ".pdf":
      var buff = fs.readFileSync(filePath);
      var data = await pdfParse(buff);
      content = data.text;
      break;
  }
  return content;
};

const saveDuplicate = async (req, res, next) => {
  var id = parseInt(req.body.idDoc);
  var filename = req.file.originalname;
  var subject = req.body.subject;
  var path = req.file.path;
  var author = req.body.authorname;
  var note = req.body.note;
  var content = await readDocument(req.file.path);
  var vector = await createVec(content);

  var arrID = [];
  var arrFilename = [];
  docmodel.find({}).exec(async function (err, docs) {
    for (doc in docs) {
      arrID.push(docs[doc].idDoc);
      arrFilename.push(docs[doc].filename);
    }
  });
  while (arrID.indexOf(id) != -1) {
    id += 1;
  }

  var index = filename.lastIndexOf(".");
  var preName = filename.slice(0, index);
  var extension = filereader.getFileExtension(filename);
  let j = 1;
  while (arrFilename.indexOf(filename) != -1) {
    filename = preName + "(" + j + ")" + extension;
    j += 1;
  }

  var data = new docmodel();
  data.idDoc = id;
  data.subject = subject;
  data.filename = filename;
  data.path = path;
  data.authorname = author;
  data.note = note;
  data.data = content;

  for (let word in vector) {
    data.vector.direction.push(word);
    data.vector.value.push(vector[word]);
  }

  data.save();
  // Thêm document vào chủ đề
  thememodel.findOne({ name: subject }).exec(function (err, theme) {
    if (err) console.log(err);
    if (!theme) console.log("Not find theme");
    else {
      theme.listidDoc.push(id);
      theme.save();
    }
  });
};

const saveDocument = async (
  id,
  filename,
  subject,
  path,
  author,
  note,
  content,
  vector
) => {
  var arrID = [];
  var arrFilename = [];
  docmodel.find({}).exec(async function (err, docs) {
    for (doc in docs) {
      arrID.push(docs[doc].idDoc);
      arrFilename.push(docs[doc].filename);
    }
  });
  while (arrID.indexOf(id) != -1) {
    id += 1;
  }

  var index = filename.lastIndexOf(".");
  var preName = filename.slice(0, index);
  var extension = filereader.getFileExtension(filename);
  let j = 1;
  while (arrFilename.indexOf(filename) != -1) {
    filename = preName + "(" + j + ")" + extension;
    j += 1;
  }

  var data = new docmodel();
  data.idDoc = id;
  data.subject = subject;
  data.filename = filename;
  data.path = path;
  data.authorname = author;
  data.note = note;
  data.data = content;

  for (let word in vector) {
    data.vector.direction.push(word);
    data.vector.value.push(vector[word]);
  }

  data.save();
  // Thêm document vào chủ đề
  thememodel.findOne({ name: subject }).exec(function (err, theme) {
    if (err) console.log(err);
    if (!theme) console.log("Not find theme");
    else {
      theme.listidDoc.push(id);
      theme.save();
    }
  });
};

const createVec = async (content) => {
  var all_text = [];
  var text = special.clear_special_chars(content);
  text = ("" + text).split(" ");
  text = sw.filter_stopword(text);

  warehouse.findOne({}).exec(function (err, t) {
    if (t) {
      for (let doc in t.allText) {
        all_text.push(t.allText[doc]);
      }
    }
    all_text.push(text);
  });
  var vec = await vector.create_vector(text, all_text);
  return vec;
};

const checkDuplicate = async (content) => {
  var arrDuplicate = [];
  var result = [];
  var vecA = createVec(content);
  // Lấy ra từng document trong db và so sánh với document vừa được upload
  docmodel.find({}).exec(async function (err, docs) {
    if (docs) {
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
      } // end for docs 1

      
    } // end if first
  });
  
  var count = 0;
  for (let r in result) {
    count += 1;
  }
  console.log("RS " + result.length);
  
  if (count > 0) {
    var d;
    for (let r in result) {
      docmodel.find({}).exec(async function (err, docs) {
      for (let doc in docs) {
        var s = String(docs[doc]._id);
        if (("" + r).indexOf(s) != -1 && result[r] <= 0) {
          d = {
            document: docs[doc].filename,
            message: "Gần như hoàn toàn giống nhau",
          };
          arrDuplicate.push(d);
        } else {
          if (("" + r).indexOf(s) != -1 && result[r] < 0.01) {
            d = {
              document: docs[doc].filename,
              message: "Rất giống nhau",
            };
            arrDuplicate.push(d);
          } else {
            if (("" + r).indexOf(s) != -1 && result[r] < 0.02) {
              d = {
                document: docs[doc].filename,
                message: "Giống nhau",
              };
              arrDuplicate.push(d);
            } else {
              if (("" + r).indexOf(s) != -1) {
                d = {
                  document: docs[doc].filename,
                  message: "Gần Giống nhau",
                };
                arrDuplicate.push(d);
              }
            }
          }
        }
      } // end for docs 2
    });
    } //end for result
    
  }

  result = [];
  return arrDuplicate;
};

const uploadDocument = async (req, res, next) => {
  var id = parseInt(req.body.idDoc);
  var filename = req.file.originalname;
  var subject = req.body.subject;
  var path = req.file.path;
  var author = req.body.authorname;
  var note = req.body.note;
  var content = await readDocument(req.file.path);
  var vecA = await createVec(content);
  var arrDuplicate = [];
  arrDuplicate = await checkDuplicate(content);
  docmodel.find({}).exec(async function (err, result) {
    if (!result) {
      // Nếu trong db chưa có document nào được up load
      console.log("Không có tài liệu trong db");
      await saveDocument(
        id,
        filename,
        subject,
        path,
        author,
        note,
        content,
        vecA
      );
    } else {
      console.log(arrDuplicate.length);
      console.log(arrDuplicate);
      if (arrDuplicate.length <= 0) {
        // Không có tài liệu tương tự
        console.log("No Duplicate");
        await saveDocument(
          id,
          filename,
          subject,
          path,
          author,
          note,
          content,
          vecA
        );
        res.send({ message:'success' });
      }
       else {
        console.log("Yes Duplicate");
        res.send({ arrDuplicate: arrDuplicate });
      }
    }
  });
};

const getAllDocument = async (req, res, next) => {
  docmodel.find(function (err, listdoc) {
    if (err) handleError();
    res.send(listdoc);
  });
};

const dowloadDocument = async (req, res, next) => {
  var id = req.params.idDowload;
  docmodel.findOne({ idDoc: id }).exec(function (err, doc) {
    if (err) console.log(err);
    if (doc) res.download(doc.path);
  });
};

const deleteDocument = async (req, res, next) => {
  var iddelete = req.params.iddelete;
  docmodel.findByIdAndRemove({ idDoc: iddelete }, function (err, doc) {
    if (data) {
      try {
        fs.unlink(doc.path, (err) => {
          if (err) throw err;
        });
      } catch (error) {}
      res.send({ message: "Delete success!" });
    }
  });
};

const searchDocument = async (req, res, next) => {
  var key = req.body.key;
  docmodel.search(key, function (err, doc) {
    res.send({ document: doc });
  });
};

module.exports = {
  saveDocument,
  saveDuplicate,
  uploadDocument,
  getAllDocument,
  dowloadDocument,
  deleteDocument,
  searchDocument,
};
