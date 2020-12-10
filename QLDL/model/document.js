const { Double } = require("mongodb");
const mongoose = require("mongoose");
const doc = new mongoose.Schema(
  {
    filename: {
      type: String,
    },
    authorname: {
      type: String,
    },
    note: {
      type: String,
    },
    data: {
      type: String,
      default: {},
    },
    vector: { direction: Array, value: Array },
  },
  { collection: "document" }
);

doc.index({ filename: "text", data: "text" });

doc.statics = {
  searchPartial: function (q, callback) {
    return this.find(
      {
        $or: [{ filename: new RegExp(q, "gi") }, { data: new RegExp(q, "gi") }],
      },
      callback
    );
  },

  searchFull: function (q, callback) {
    return this.find(
      {
        $text: { $search: q, $caseSensitive: false },
      },
      callback
    );
  },

  search: function (q, callback) {
    this.searchFull(q, (err, result) => {
      // if (err) return callback(err, result);
      // if (!err && result.length) {
      //   console.log("FULL");
      //   return callback(err, result);
      // }
      // if (!err && result.length === 0) {
      //   console.log("PART");
      return this.searchPartial(q, callback);
      //}
    });
  },
};

module.exports = mongoose.model("document", doc);
