var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userschema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, default: "2" },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userschema);
