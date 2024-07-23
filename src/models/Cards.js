const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "none" },
  folder: { type: String, default: "none" },
  website: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Card", CardSchema);
