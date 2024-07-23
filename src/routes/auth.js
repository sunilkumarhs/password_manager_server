const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  verifyOtp,
  getUser,
} = require("../controllers/authentication");
const { validateData } = require("../middlewares/validation");
const {
  userRegistrationSchema,
  userLoginSchema,
} = require("../schemas/userSchemas");
const isAuth = require("../middlewares/is-Authenticated");

router.put("/register", validateData(userRegistrationSchema), registerUser);
router.post("/login", validateData(userLoginSchema), login);
router.post("/verifyOtp", verifyOtp);
router.get("/fetchUser/:id", isAuth, getUser);

module.exports = router;
