var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var themeSchema = new Schema(
  {
    idtheme: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    listidDoc: {
      type: Array,
    },
  },
  { collection: "themes" }
);

module.exports = mongoose.model("Theme", themeSchema);
