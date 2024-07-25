const express = require("express");
const router = express.Router();
const {
  addCard,
  getCards,
  updatedCard,
  deleteCard,
} = require("../controllers/cardsMng");
const { validateData } = require("../middlewares/validation");
const { CardFormSchema } = require("../schemas/passwordSchema");
const isAuth = require("../middlewares/is-Authenticated");

router.post("/addCard", isAuth, validateData(CardFormSchema), addCard);
router.post(
  "/editCard/:cardId",
  isAuth,
  validateData(CardFormSchema),
  updatedCard
);
router.get("/getCards", isAuth, getCards);
router.delete("/deleteCard/:cardId", isAuth, deleteCard);

module.exports = router;
