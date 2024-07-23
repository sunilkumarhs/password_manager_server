const { date } = require("zod");
const Password = require("../models/Passwords");
const { encryptData } = require("../middlewares/encryptData");

exports.getPasswords = async (req, res, next) => {
  try {
    const passwords = await Password.find({ userId: req.userId });
    if (!passwords) {
      const error = new Error("Fetching of posts failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Adding Password successfull!",
      passwords: passwords,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addPassword = async (req, res, next) => {
  const { name, folder, website, username, password, notes } = req.body;
  try {
    const encWebsite = encryptData(website);
    const encUsername = encryptData(username);
    const encPassword = encryptData(password);
    const encNotes = encryptData(notes);
    const newPassword = new Password({
      userId: req.userId,
      name,
      folder,
      encWebsite,
      encUsername,
      encPassword,
      encNotes,
    });
    const savedPassword = await newPassword.save();
    res.status(201).json({
      message: "Adding Password successfull!",
      password: savedPassword,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatedPassword = async (req, res, next) => {
  const { id, name, folder, website, username, password, createdAt } = req.body;
  try {
    const encWebsite = encryptData(website);
    const encUsername = encryptData(username);
    const encPassword = encryptData(password);
    const updatePassword = await Password.findById(id);
    if (!updatePassword) {
      const error = new Error("Password was not found!!");
      error.statusCode = 404;
      throw error;
    }
    password.name = name;
    password.folder = folder;
    password.website = encWebsite;
    password.username = encUsername;
    password.password = encPassword;
    password.createdAt = createdAt;
    password.updatedAt = date.now();
    const updatedPassword = await password.save();
    if (!result) {
      const error = new Error("Password updation failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "Update Password successfull!",
      password: updatedPassword,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePassword = async (req, res, next) => {
  const passId = req.params.passId;
  try {
    const password = await Password.findById(passId);
    if (!password) {
      const error = new Error("Password was not found!!");
      error.statusCode = 404;
      throw error;
    }
    const result = await Password.deleteOne({
      _id: new mongoDb.ObjectId(passId),
    });
    if (!result) {
      const error = new Error("Password deletion failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Deleted Password successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
