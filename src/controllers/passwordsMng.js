const Password = require("../models/Passwords");
const { encryptData } = require("../middlewares/encryptData");
const mongoDb = require("mongodb");

exports.getPasswords = async (req, res, next) => {
  try {
    const passwords = await Password.find({ userId: req.userId });
    if (!passwords) {
      const error = new Error("Fetching of passwords failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Passwords fetch successfull!",
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
  const { name, folder, website, userName, password, notes } = req.body.body;
  try {
    const encWebsite = encryptData(website, req.userId);
    const encUsername = encryptData(userName, req.userId);
    const encPassword = encryptData(password, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const newPassword = new Password({
      userId: req.userId,
      name,
      folder,
      website: encWebsite,
      username: encUsername,
      password: encPassword,
      notes: encNotes,
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
  const { name, folder, website, userName, password, notes, createdAt } =
    req.body.body;
  const id = req.params.passId;
  try {
    const encWebsite = encryptData(website, req.userId);
    const encUsername = encryptData(userName, req.userId);
    const encPassword = encryptData(password, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const updatePassword = await Password.findById(id);
    if (!updatePassword) {
      const error = new Error("Password was not found!!");
      error.statusCode = 404;
      throw error;
    }
    updatePassword.name = name;
    updatePassword.folder = folder;
    updatePassword.website = encWebsite;
    updatePassword.username = encUsername;
    updatePassword.password = encPassword;
    updatePassword.notes = encNotes;
    updatePassword.createdAt = createdAt;
    updatePassword.updatedAt = Date.now();
    const result = await updatePassword.save();
    if (!result) {
      const error = new Error("Password updation failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "Update Password successfull!",
      password: result,
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
