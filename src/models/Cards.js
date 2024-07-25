const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "none" },
  folder: { type: String, default: "none" },
  cardName: { type: String, required: true },
  type: { type: String, required: true },
  cardNumber: { type: String, required: true },
  cvvCode: { type: String, required: true },
  startDate: { type: String },
  startYear: { type: String },
  endDate: { type: String, required: true },
  endYear: { type: String, required: true },
  notes: { type: String },
});

module.exports = mongoose.model("Card", CardSchema);
