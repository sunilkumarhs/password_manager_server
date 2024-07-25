const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  verifyOtp,
  getUser,
  verifyEmail,
  passwordReset,
} = require("../controllers/authentication");
const { validateData } = require("../middlewares/validation");
const {
  userRegistrationSchema,
  userLoginSchema,
  emailVerifySchema,
  passwordSchema,
} = require("../schemas/userSchemas");
const isAuth = require("../middlewares/is-Authenticated");

router.put("/register", validateData(userRegistrationSchema), registerUser);
router.post("/login", validateData(userLoginSchema), login);
router.post("/verifyOtp", verifyOtp);
router.post("/verifyEmail", validateData(emailVerifySchema), verifyEmail);
router.post("/resetPass", isAuth, validateData(passwordSchema), passwordReset);
router.get("/fetchUser", isAuth, getUser);

module.exports = router;
