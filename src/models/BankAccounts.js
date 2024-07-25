const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "none" },
  folder: { type: String, default: "none" },
  bankName: { type: String, required: true },
  accType: { type: String, required: true },
  accNumber: { type: String, required: true },
  branchCode: { type: String },
  ifscCode: { type: String, required: true },
  branchPhone: { type: String },
  notes: { type: String },
});

module.exports = mongoose.model("Bank", BankSchema);
