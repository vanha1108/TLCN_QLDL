var pdfreader = require("pdfreader");

var rows = {}; // indexed by y-position
var result;
function printRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    //.sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => console.log((rows[y] || []).join("")));
  //.forEach((y) => (result += (rows[y] || []).join(""))) + " ";
}

module.exports.readPDF = function (filepath) {
  new pdfreader.PdfReader().parseFileItems(filepath, function (err, item) {
    if (!item || item.page) {
      // end of file, or page
      printRows();

      rows = {}; // clear rows for next page
    } else if (item.text) {
      // accumulate text items into rows object, per line
      (rows[item.y] = rows[item.y] || []).push(item.text);
    }
    //console.log(result);
    //return result;
  });
};
