const mongoose = require("mongoose");

const PasswordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "none" },
  folder: { type: String, default: "none" },
  website: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  notes: { type: String, default: "none" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Password", PasswordSchema);
