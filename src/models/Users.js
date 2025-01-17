const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { encUserData } = require("../middlewares/encryptData");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avtarIndex: { type: Number, default: 0 },
  reminder: { type: String, default: "none" },
  createdAt: { type: Date, default: Date.now },
  otp: Number,
  otpToken: String,
  otpTokenExperiation: Date,
  resetToken: String,
  resetTokenExperiation: Date,
});

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  const hashPass = await bcrypt.hash(this.password, salt);
  this.password = encUserData(hashPass);
  next();
});

module.exports = mongoose.model("User", UserSchema);
