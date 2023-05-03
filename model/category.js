const mongoose = require("mongoose");
const category = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String },
});

exports.Category = mongoose.model("Category", category);
