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
    listidDoc: [{ type: Number }],
  },
  { collection: "themes", timestamps: true }
);

module.exports = mongoose.model("Theme", themeSchema);
