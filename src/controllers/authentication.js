const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");
const { randomBytes } = require("node:crypto");
const otpGenerator = require("otp-generator");
const { decUserData } = require("../middlewares/encryptData");

dotenv.config();

const transporter = nodeMailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.NODE_SERVER_SENDGRID_KEY,
    },
  })
);

exports.registerUser = async (req, res, next) => {
  const { email, password, reminder } = req.body.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }
    const buf = randomBytes(256);
    if (!buf) {
      const error = new Error("randomBytes error!!");
      throw error;
    }
    const otpToken = buf.toString("hex");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    otpTokenExperiation = Date.now() + 120000;
    const newUser = new User({
      email,
      password,
      reminder,
      otp,
      otpToken,
      otpTokenExperiation,
    });
    const result = await newUser.save();
    if (!result) {
      const error = new Error("Error in saving user!!");
      throw error;
    }
    transporter.sendMail({
      to: email,
      from: "puppetmaster010420@gmail.com",
      subject: "One Time Password!",
      html: `
        <p>OTP for verifying user</p>
        <p>Your otp is ${otp}</p>
        <p>The OTP is valid for 2 minutes only!</p>
        `,
    });
    res.status(201).json({
      message: "SignUp successfull!",
      otpToken: otpToken,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Invalid credential Email not Found!");
      error.statusCode = 404;
      throw error;
    }
    const decPass = decUserData(user.password);
    const isMatch = await bcrypt.compare(password, decPass);
    if (!isMatch) {
      const error = new Error("Invalid credentials!");
      error.statusCode = 400;
      throw error;
    }
    const buf = randomBytes(256);
    if (!buf) {
      const error = new Error("randomBytes error!!");
      throw error;
    }
    const token = buf.toString("hex");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    user.otp = otp;
    user.otpToken = token;
    user.otpTokenExperiation = Date.now() + 120000;
    const result = await user.save();
    if (!result) {
      const error = new Error("Error in saving user!!");
      throw error;
    }
    transporter.sendMail({
      to: email,
      from: "puppetmaster010420@gmail.com",
      subject: "One Time Password!",
      html: `
          <p>OTP for verifying user</p>
          <p>Your otp is ${otp}</p>
          <p>The OTP is valid for 2 minutes only!</p>
          `,
    });
    res.status(201).json({
      message: "Password match successfull!",
      otpToken: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.verifyOtp = async (req, res, next) => {
  const { otpToken, otp } = req.body.body;
  try {
    if (otpToken === "") {
      const error = new Error("Invalid Token");
      error.statusCode = 404;
      throw error;
    }
    const user = await User.findOne({
      otpToken: otpToken,
      otpTokenExperiation: { $gt: Date.now() },
    });
    if (!user) {
      const error = new Error("User Not Found or Invalid Token");
      error.statusCode = 404;
      throw error;
    }
    if (user.otp.toString() !== otp) {
      const error = new Error("Invalid OTP");
      error.statusCode = 400;
      throw error;
    }
    user.otp = null;
    user.otpToken = "";
    user.otpTokenExperiation = null;
    user.save();
    const jwtToken = jwt.sign(
      { otpId: otpToken, userId: user._id },
      process.env.NODE_SERVER_JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).json({
      message: "User signedIn successfully!",
      token: jwtToken,
      userId: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user Request");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      email: user.email,
      clue: user.reminder,
      avtarIndex: user.avtarIndex,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeAvtar = async (req, res, next) => {
  const { avtarIndex } = req.body.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user Request");
      error.statusCode = 400;
      throw error;
    }
    user.avtarIndex = avtarIndex;
    const result = await user.save();
    if (!result) {
      const error = new Error("User Saving Error");
      error.statusCode = 400;
      throw error;
    }
    res.status(201).json({
      message: "Saved avtar successfully.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  const { email } = req.body.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Invalid credential Email not Found!");
      error.statusCode = 404;
      throw error;
    }
    const buf = randomBytes(256);
    if (!buf) {
      const error = new Error("randomBytes error!!");
      throw error;
    }
    const token = buf.toString("hex");
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    user.otp = otp;
    user.otpToken = token;
    user.otpTokenExperiation = Date.now() + 120000;
    const result = await user.save();
    if (!result) {
      const error = new Error("user saving error!!");
      throw error;
    }
    transporter.sendMail({
      to: email,
      from: "puppetmaster010420@gmail.com",
      subject: "One Time Password!",
      html: `
          <p>OTP for verifying user</p>
          <p>Your otp is ${otp}</p>
          <p>The OTP is valid for 2 minutes only!</p>
          `,
    });
    res.status(200).json({
      message: "Password reset OTP sent successfully!",
      otpToken: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.passwordReset = async (req, res, next) => {
  const { password } = req.body.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user not found");
      error.statusCode = 404;
      throw error;
    }
    user.password = password;
    const result = await user.save();
    if (!result) {
      const error = new Error("Saving user failed");
      error.statusCode = 400;
      throw error;
    }
    res.status(201).json({
      message: "Password updated successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { password, newPassword } = req.body.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user not found");
      error.statusCode = 404;
      throw error;
    }
    const decPass = decUserData(user.password);
    const isMatch = await bcrypt.compare(password, decPass);
    if (!isMatch) {
      const error = new Error("Password credential worng, check password!");
      error.statusCode = 400;
      throw error;
    }
    user.password = newPassword;
    const result = await user.save();
    if (!result) {
      const error = new Error("Saving user failed");
      error.statusCode = 400;
      throw error;
    }
    res.status(201).json({
      message: "Password updated successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};