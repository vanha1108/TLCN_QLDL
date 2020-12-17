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
const { ObjectId } = require("mongodb");

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
  var idDoc = id;
  var nameFile = filename;
  var arrID = [];
  var arrFilename = [];
  await docmodel.find({}).exec(async function (err, docs) {
    for (doc in docs) {
      arrID.push(docs[doc].idDoc);
      arrFilename.push(docs[doc].filename);
    }

    while (arrID.indexOf(idDoc) != -1) {
      idDoc += 1;
    }

    var index = nameFile.lastIndexOf(".");
    var preName = nameFile.slice(0, index);
    var extension = filereader.getFileExtension(nameFile);
    let j = 1;
    while (arrFilename.indexOf(nameFile) != -1) {
      nameFile = preName + "(" + j + ")" + extension;
      j += 1;
    }

    var data = new docmodel();
    data.idDoc = idDoc;
    data.subject = subject;
    data.filename = nameFile;
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
        theme.listidDoc.push(idDoc);
        theme.save();
      }
    });
  });
};

const createVec = async (content) => {
  var all_text = [];
  var text = special.clear_special_chars(content);
  text = ("" + text).split(" ");
  text = sw.filter_stopword(text);

  const ware = await warehouse.find();

  for (let doc in ware.allText) {
    all_text.push(t.allText[doc]);
  }
  all_text.push(text);
  var vec = await vector.create_vector(text, all_text);
  return vec;
};

const checkDuplicate = async (content) => {
  var arrDuplicate = [];
  var result = [];
  var vecA = await createVec(content);
  // Lấy ra từng document trong db và so sánh với document vừa được upload
  var allDoc = await docmodel.find();
  if (allDoc) {
    for (let doc in allDoc) {
      var vecB = [];
      var direc = allDoc[doc].vector.direction;
      var value = allDoc[doc].vector.value;

      for (let i = 0; i < direc.length; i++) {
        vecB[direc[i]] = value[i];
      }

      var distance = euclid.compute_distance(vecA, vecB);
    

      if (distance < 0.03) {
        result[allDoc[doc]._id] = distance;
      }
    }
  }

  var count = 0;
  for (let r in result) {
    count += 1;
  }

  if (count > 0) {
    var d;
    for (let r in result) {
      var similar = await docmodel.findOne({ _id: r });
      if (similar)
        if (result[r] <= 0) {
          d = {
            document: similar.filename,
            message: "Gần như hoàn toàn giống nhau",
          };
          arrDuplicate.push(d);
        } else {
          if (result[r] < 0.01) {
            d = {
              document: similar.filename,
              message: "Rất giống nhau",
            };
            arrDuplicate.push(d);
          } else {
            if (result[r] < 0.02) {
              d = {
                document: similar.filename,
                message: "Giống nhau",
              };
              arrDuplicate.push(d);
            } else {
              d = {
                document: similar.filename,
                message: "Gần Giống nhau",
              };
              arrDuplicate.push(d);
            }
          }
        }
    }
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
  console.log(arrDuplicate)

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
        res.send({ message: "success" });
      } else {
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
