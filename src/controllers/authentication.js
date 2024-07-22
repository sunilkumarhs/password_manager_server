const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");
const { randomBytes } = require("node:crypto");
const otpGenerator = require("otp-generator");

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
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    randomBytes(256, (err, buf) => {
      if (err) throw err;
      const token = buf.toString("hex");
      user = new User({
        email,
        password,
        reminder,
      });
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      user.save().then((result) => {
        User.findById(result._id)
          .then((user) => {
            if (!user) {
              const error = new Error("user not found!!");
              error.statusCode = 404;
              throw error;
            }
            user.otp = otp;
            user.otpToken = token;
            user.otpTokenExperiation = Date.now() + 60000;
            return user.save();
          })
          .then((result) => {
            transporter.sendMail({
              to: email,
              from: "puppetmaster010420@gmail.com",
              subject: "One Time Password!",
              html: `
                <p>OTP for verifying user</p>
                <p>Your otp is ${otp}</p>
                <p>The OTP is valid for 1 minutes only!</p>
                `,
            });
            res.status(201).json({
              message: "SignUp successfull!",
              otpToken: token,
            });
          });
      });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    user.otp = otp;
    user.otpToken = token;
    user.otpTokenExperiation = Date.now() + 60000;
    user.save().then((result) => {
      transporter.sendMail({
        to: email,
        from: "puppetmaster010420@gmail.com",
        subject: "One Time Password!",
        html: `
            <p>OTP for verifying user</p>
            <p>Your otp is ${otp}</p>
            <p>The OTP is valid for 1 minutes only!</p>
            `,
      });
      res.status(201).json({
        message: "Password match successfull!",
        otpToken: token,
      });
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.verifyOtp = async (req, res, next) => {
  const { otpToken, otp } = req.body;
  try {
    User.findOne({
      otpToken: otpToken,
      otpTokenExperiation: { $gt: Date.now() },
    }).then((user) => {
      if (!user.otp === otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      const payload = {
        otp: otpToken,
      };
      jwt.sign(
        payload,
        process.env.NODE_SERVER_JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            message: "User signedIn successfully!",
            token: token,
            userId: user._id.toString(),
          });
        }
      );
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.verifyToken = async (req, res) => {
  res.json(req.user);
};
