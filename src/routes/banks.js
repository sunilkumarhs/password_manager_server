const express = require("express");
const router = express.Router();
const {
  addBank,
  getBanks,
  updatedBank,
  deleteBank,
} = require("../controllers/banksMng");
const { validateData } = require("../middlewares/validation");
const { BankFormSchema } = require("../schemas/passwordSchema");
const isAuth = require("../middlewares/is-Authenticated");

router.post("/addBank", isAuth, validateData(BankFormSchema), addBank);
router.post(
  "/editBank/:bankId",
  isAuth,
  validateData(BankFormSchema),
  updatedBank
);
router.get("/getBanks", isAuth, getBanks);
router.delete("/deleteBank/:bankId", isAuth, deleteBank);

module.exports = router;
