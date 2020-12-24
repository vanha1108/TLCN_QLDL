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
      res
        .status(200)
        .json({ success: true, code: 200, message: "Add theme success" });
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
  console.log("Here");
  var idDelete = req.params.idDelete;
  thememodel.findOne({ _id: idDelete }).exec(function (err, data) {
    if (err) res.send({ message: err });
    if (data) {
      if (data.listidDoc.length != 0) {
        res.send({ message: "Theme cannot be deleted" });
      } else {
        thememodel.findByIdAndRemove({ _id: idDelete }, function (err, de) {
          if (err) handleError();
          if (de)
            res
              .status(200)
              .json({ success: true, code: 200, message: "Delete success" });
        });
      }
    }
  });
};

const editTheme = async (req, res, next) => {
  var idEdit = req.params.idEdit;
  var newName = req.body.newName;

  const theme = await thememodel.findById(idEdit);
  if (!theme) {
    return res
      .status(200)
      .json({ success: false, code: 404, message: "Not found theme with id!" });
  }

  const newtheme = await thememodel.findOne({ name: newName });

  if (newtheme) {
    return res.status(200).json({
      success: false,
      code: 500,
      message: "Theme name already exists",
    });
  }

  theme.name = newName;
  theme.save();

  if (theme.listidDoc.length > 0) {
    for (let i in theme.listidDoc) {
      var doc = await docmodel.findOne({ idDoc: theme.listidDoc[i] });
      if (!doc) {
        return res.status(200).json({
          success: false,
          code: 404,
          message: "Not found document with id!",
        });
      }

      doc.subject = newName;
      doc.save();
    }
    return res
      .status(200)
      .json({ success: true, code: 200, message: "Edit theme success" });
  }
};

module.exports = {
  addTheme,
  getAllTheme,
  deleteTheme,
  editTheme,
};
