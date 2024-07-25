const Bank = require("../models/BankAccounts");
const { encryptData } = require("../middlewares/encryptData");
const mongoDb = require("mongodb");

exports.getBanks = async (req, res, next) => {
  try {
    const banks = await Bank.find({ userId: req.userId });
    if (!banks) {
      const error = new Error("Fetching of banks failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Banks fetch successfull!",
      banks: banks,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addBank = async (req, res, next) => {
  const {
    name,
    folder,
    bankName,
    accType,
    accNumber,
    branchCode,
    IFSCCode,
    branchPhone,
    notes,
  } = req.body.body;
  try {
    const encBankName = encryptData(bankName, req.userId);
    const encAccType = encryptData(accType, req.userId);
    const encAccNumber = encryptData(accNumber, req.userId);
    const encBranchCode = encryptData(branchCode, req.userId);
    const encIFSCCode = encryptData(IFSCCode, req.userId);
    const encBranchPhone = encryptData(branchPhone, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const newBank = new Bank({
      userId: req.userId,
      name,
      folder,
      bankName: encBankName,
      accType: encAccType,
      accNumber: encAccNumber,
      branchCode: encBranchCode,
      ifscCode: encIFSCCode,
      branchPhone: encBranchPhone,
      notes: encNotes,
    });
    const savedBank = await newBank.save();
    res.status(201).json({
      message: "Adding Bank successfull!",
      bank: savedBank,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatedBank = async (req, res, next) => {
  const {
    name,
    folder,
    bankName,
    accType,
    accNumber,
    branchCode,
    IFSCCode,
    branchPhone,
    notes,
  } = req.body.body;
  const id = req.params.bankId;
  try {
    const encBankName = encryptData(bankName, req.userId);
    const encAccType = encryptData(accType, req.userId);
    const encAccNumber = encryptData(accNumber, req.userId);
    const encBranchCode = encryptData(branchCode, req.userId);
    const encIFSCCode = encryptData(IFSCCode, req.userId);
    const encBranchPhone = encryptData(branchPhone, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const updateBank = await Bank.findById(id);
    if (!updateBank) {
      const error = new Error("Bank was not found!!");
      error.statusCode = 404;
      throw error;
    }
    updateBank.name = name;
    updateBank.folder = folder;
    updateBank.bankName = encBankName;
    updateBank.accType = encAccType;
    updateBank.accNumber = encAccNumber;
    updateBank.branchCode = encBranchCode;
    updateBank.ifscCode = encIFSCCode;
    updateBank.branchPhone = encBranchPhone;
    updateBank.notes = encNotes;
    const result = await updateBank.save();
    if (!result) {
      const error = new Error("Bank updation failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "Update Bank successfull!",
      bank: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteBank = async (req, res, next) => {
  const bankId = req.params.bankId;
  try {
    const bank = await Bank.findById(bankId);
    if (!bank) {
      const error = new Error("Bank was not found!!");
      error.statusCode = 404;
      throw error;
    }
    const result = await Bank.deleteOne({
      _id: new mongoDb.ObjectId(bankId),
    });
    if (!result) {
      const error = new Error("Bank deletion failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Deleted Bank successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
