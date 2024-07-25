const Note = require("../models/Notes");
const { encryptData } = require("../middlewares/encryptData");
const mongoDb = require("mongodb");

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    if (!notes) {
      const error = new Error("Fetching of notes failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Notes fetch successfull!",
      notes: notes,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addNote = async (req, res, next) => {
  const { name, folder, notes } = req.body.body;
  try {
    const encName = encryptData(name, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const newNote = new Note({
      userId: req.userId,
      name: encName,
      folder,
      notes: encNotes,
    });
    const savedNote = await newNote.save();
    res.status(201).json({
      message: "Adding Note successfull!",
      note: savedNote,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatedNote = async (req, res, next) => {
  const { name, folder, notes, createdAt } = req.body.body;
  const id = req.params.noteId;
  try {
    const encName = encryptData(name, req.userId);
    const encNotes = encryptData(notes, req.userId);
    const updateNote = await Note.findById(id);
    if (!updateNote) {
      const error = new Error("Note was not found!!");
      error.statusCode = 404;
      throw error;
    }
    updateNote.name = encName;
    updateNote.folder = folder;
    updateNote.notes = encNotes;
    updateNote.createdAt = createdAt;
    updateNote.updatedAt = Date.now();
    const result = await updateNote.save();
    if (!result) {
      const error = new Error("Note updation failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json({
      message: "Update Note successfull!",
      note: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  try {
    const note = await Note.findById(noteId);
    if (!note) {
      const error = new Error("Note was not found!!");
      error.statusCode = 404;
      throw error;
    }
    const result = await Note.deleteOne({
      _id: new mongoDb.ObjectId(noteId),
    });
    if (!result) {
      const error = new Error("Note deletion failed!!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "Deleted Note successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
