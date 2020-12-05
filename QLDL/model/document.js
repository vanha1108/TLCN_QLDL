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
  },
  { collection: "document" }
);
module.exports = mongoose.model("document", doc);
