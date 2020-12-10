module.exports.clear_special_chars = function (text) {
  text = ("" + text).replace(/[’“”%&!’#√.*+?,;^${}()_`'"|[\]\\//]/g, " ");
  text = ("" + text).replace(/[0-9]/g, "");
  text = ("" + text).replace(/(\r\n\t|\n|\r)/gm, " ");
  text = ("" + text).replace(/[=]/g, " ");
  text = ("" + text).replace(/[:]/g, " ");
  text = ("" + text).replace(/[-]/g, " ");
  text = ("" + text).replace(/[>]/g, " ");
  text = ("" + text).replace(/[<]/g, " ");
  text = ("" + text).replace(/[@]/g, " ");
  text = ("" + text).replace(/\s+/g, " ");
  text = ("" + text).replace(/[0-9]/g, " ");
  text = ("" + text).replace("length", " ");
  text = ("" + text).toLocaleLowerCase();
  text = ("" + text).trim();
  text = ("" + text).trim();
  return text;
};
