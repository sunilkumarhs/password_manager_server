const Card = require("../models/Cards");
const { encryptData } = require("../middlewares/encryptData");
const mongoDb = require("mongodb");

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ userId: req.userId });
    if (!cards) {
      const error = new Error("Fetching of cards failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Cards fetch successfull!",
      cards: cards,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addCard = async (req, res, next) => {
  const {
    name,
    folder,
    cardName,
    type,
    cardNumber,
    cvvCode,
    startDate,
    startYear,
    endDate,
    endYear,
    notes,
  } = req.body.body;
  try {
    const encCardName = encryptData(cardName, req.userId);
    const enctype = encryptData(type, req.userId);
    const encCardNumber = encryptData(cardNumber, req.userId);
    const encCvvCode = encryptData(cvvCode, req.userId);
    const encStartDate = encryptData(startDate, req.userId);
    const encStartYear = encryptData(startYear, req.userId);
    const encEndDate = encryptData(endDate, req.userId);
    const encEndYear = encryptData(endYear, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const newCard = new Card({
      userId: req.userId,
      name,
      folder,
      cardName: encCardName,
      type: enctype,
      cardNumber: encCardNumber,
      cvvCode: encCvvCode,
      startDate: encStartDate,
      startYear: encStartYear,
      endDate: encEndDate,
      endYear: encEndYear,
      notes: encNotes,
    });
    const savedCard = await newCard.save();
    res.status(201).json({
      message: "Adding Card successfull!",
      card: savedCard,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatedCard = async (req, res, next) => {
  const {
    name,
    folder,
    cardName,
    type,
    cardNumber,
    cvvCode,
    startDate,
    startYear,
    endDate,
    endYear,
    notes,
  } = req.body.body;
  const id = req.params.cardId;
  try {
    const encCardName = encryptData(cardName, req.userId);
    const enctype = encryptData(type, req.userId);
    const encCardNumber = encryptData(cardNumber, req.userId);
    const encCvvCode = encryptData(cvvCode, req.userId);
    const encStartDate = encryptData(startDate, req.userId);
    const encStartYear = encryptData(startYear, req.userId);
    const encEndDate = encryptData(endDate, req.userId);
    const encEndYear = encryptData(endYear, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const updateCard = await Card.findById(id);
    if (!updateCard) {
      const error = new Error("Card was not found!!");
      error.statusCode = 404;
      throw error;
    }
    updateCard.name = name;
    updateCard.folder = folder;
    updateCard.cardName = encCardName;
    updateCard.type = enctype;
    updateCard.cardNumber = encCardNumber;
    updateCard.cvvCode = encCvvCode;
    updateCard.startDate = encStartDate;
    updateCard.startYear = encStartYear;
    updateCard.endDate = encEndDate;
    updateCard.endYear = encEndYear;
    updateCard.notes = encNotes;
    const result = await updateCard.save();
    if (!result) {
      const error = new Error("Card updation failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "Update Card successfull!",
      card: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCard = async (req, res, next) => {
  const cardId = req.params.cardId;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      const error = new Error("Card was not found!!");
      error.statusCode = 404;
      throw error;
    }
    const result = await Card.deleteOne({
      _id: new mongoDb.ObjectId(cardId),
    });
    if (!result) {
      const error = new Error("Card deletion failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Deleted Card successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
