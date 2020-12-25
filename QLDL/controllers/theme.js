var thememodel = require("./../model/theme");
var docmodel = require("./../model/document");

const addTheme = async (req, res, next) => {
  var idtheme = Number(req.body.idtheme);
  var name = req.body.name;
  const theme = await thememodel.findOne({ name });
  if (theme) {
    res.status(200).json({
      success: false,
      code: 500,
      message: "Theme name already exists!",
    });
  }
  const newTheme = new thememodel();
  // Kiem tra idtheme da co chua
  const arrIDTheme = [];
  const themes = await thememodel.find();
  if (users) {
    for (let t in themes) {
      arrIDTheme.push(themes[t].idtheme);
    }
  }
  while (arrIDTheme.indexOf(idtheme) != -1) {
    idtheme += 1;
  }
  //
  newTheme.idtheme = idtheme;
  newTheme.name = name;
  newTheme.listidDoc = [];
  await newTheme.save();
  res
    .status(200)
    .json({ success: true, code: 200, message: "Add theme success" });
};

const getAllTheme = async (req, res, next) => {
  thememodel.find(function (err, listtheme) {
    if (err)
      res
        .status(200)
        .json({ success: false, code: 500, message: "Error get all theme!" });
    res.status(200).json({ success: true, code: 200, message: "", listtheme });
  });
};

const deleteTheme = async (req, res, next) => {
  var iddelete = req.params.iddelete;
  const theme = thememodel.findOne({ idtheme: iddelete });
  if (!theme)
    return res.status(200).json({
      success: false,
      code: 500,
      message: "Not found theme to delete!",
    });
    console.log(theme.listidDoc);
    return;
  if (theme.listidDoc.length != 0) {
    res
      .status(200)
      .json({ success: false, code: 500, message: "Theme cannot be deleted" });
  }
  const themeDel = thememodel.findOneAndRemove({ idtheme: iddelete });
  if (!themeDel)
    res
      .status(200)
      .json({ success: false, code: 500, message: "Error delete theme!" });
  res.status(200).json({ success: true, code: 200, message: "Delete success" });
};

const editTheme = async (req, res, next) => {
  var idedit = req.params.idedit;
  var newName = req.body.newName;

  const theme = await thememodel.findOne({ idtheme: idedit });
  if (!theme) {
    return res
      .status(200)
      .json({ success: false, code: 404, message: "Not found theme with id!" });
  }

  const newtheme = await thememodel.findOne({ name: newName });

  if (newtheme)
    return res.status(200).json({
      success: false,
      code: 500,
      message: "Theme name already exists",
    });

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
