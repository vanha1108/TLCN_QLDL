var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var themeSchema = new Schema(
  {
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
