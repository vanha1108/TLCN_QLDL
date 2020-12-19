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
    role: {
      type: Number,
      default: 2,
    },
  },
  { collection: "users", timestamps: true }
);

module.exports = mongoose.model("User", userschema);
