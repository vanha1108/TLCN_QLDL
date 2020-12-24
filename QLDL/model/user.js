var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userschema = new Schema(
  {
    iduser: {
      type: Number,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    sex: {
      type: Boolean,
    },
    dbo: {
      type: Date,
    },
    phonenumber: {
      type: String,
    },
    address: {
      type: String,
    },
    username: {
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
