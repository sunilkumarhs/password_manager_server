const express = require("express");
const router = express.Router();
const {
  addNote,
  getNotes,
  updatedNote,
  deleteNote,
} = require("../controllers/notesMng");
const { validateData } = require("../middlewares/validation");
const { NotesFormSchema } = require("../schemas/passwordSchema");
const isAuth = require("../middlewares/is-Authenticated");

router.post("/addNote", isAuth, validateData(NotesFormSchema), addNote);
router.post(
  "/editNote/:noteId",
  isAuth,
  validateData(NotesFormSchema),
  updatedNote
);
router.get("/getNotes", isAuth, getNotes);
router.delete("/deleteNote/:noteId", isAuth, deleteNote);

module.exports = router;
