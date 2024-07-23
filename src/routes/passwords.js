const express = require("express");
const router = express.Router();
const {
  addPassword,
  updatedPassword,
  getPasswords,
  deletePassword,
} = require("../controllers/passwordsMng");
const { validateData } = require("../middlewares/validation");
const { SiteFormSchema } = require("../schemas/passwordSchema");
const isAuth = require("../middlewares/is-Authenticated");

router.put("/addSite", isAuth, validateData(SiteFormSchema), addPassword);
router.post("/editSite", isAuth, validateData(SiteFormSchema), updatedPassword);
router.get("/getSites", isAuth, getPasswords);
router.get("/deleteSite", isAuth, deletePassword);

module.exports = router;
