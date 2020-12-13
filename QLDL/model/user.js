var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userschema = new Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: { type: String, default: "2" },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userschema);
