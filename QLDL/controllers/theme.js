var thememodel = require("./../model/theme");
var docmodel = require("./../model/document");

const addTheme = async (req, res, next) => {
  var subjectName = req.body.name;
  thememodel.findOne({ name: subjectName }).exec(function (err, data) {
    if (err) console.log(err);
    if (data) {
      res.send({ message: "Theme name already exists!" });
    } else {
      var data = new thememodel();
      data.name = req.body.name;
      data.listidDoc = [];
      data.save();
      res.send("Add theme success!");
    }
  });
};

const getAllTheme = async (req, res, next) => {
  thememodel.find(function (err, listtheme) {
    if (err) handleError();
    res.send(listtheme);
  });
};

const deleteTheme = async (req, res, next) => {
  var idDelete = req.params.idDelete;
  thememodel.findOne({ _id: idDelete }).exec(function (err, data) {
    if (err) res.send({ message: err });
    if (data) {
      if (data.listidDoc.length != 0) {
        res.send({ message: "Theme cannot be deleted" });
      } else {
        thememodel.findByIdAndRemove({ _id: idDelete }, function (err, de) {
          if (err) handleError();
          if (de) res.send({ message: "Delete success" });
        });
      }
    }
  });
};

const editTheme = async (req, res, next) => {
  var idEdit = req.params.idEdit;
  var newName = req.body.newName;
  await thememodel.findOne({ _id: idEdit }).exec(async function (err, data) {
    if (err) res.send({ message: err });
    await thememodel.findOne({ name: newName }, function (err, re) {
      if (err) res.send({ message: err });
      if (re) {
        res.send({ message: "Theme name already exists" });
      } else {
        var oldSubject = re.subject;
        var dt = new thememodel();
        dt.name = newName;
        dt.save();

        if (re.listidDoc.length <= 0) {
          for (let i in re.listidDoc) {
            docmodel.find({ subject: re.listidDoc[i] }, function (err, result) {
              if (err) res.send({ message: err });
              if (!result) {
                res.send({ message: "Not found document!" });
              } else {
                for (let doc in result) {
                  result[doc].subject = newName;
                  result[doc].save();
                }
              }
            });
          }
        }
        res.send({ message: "Edit theme success!" });
      }
    });
  });
};

module.exports = {
  addTheme,
  getAllTheme,
  deleteTheme,
  editTheme,
};
