const mongoose = require("mongoose");
const ware = new mongoose.Schema(
  {
    total: {
      type: Number,
    },
    allText: {
      type: Array,
    },
  },
  { collection: "dataWarehouse" }
);

module.exports = mongoose.model("Warehouse", ware);
