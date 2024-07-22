const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  verifyToken,
  verifyOtp,
} = require("../controllers/authentication");
const { validateData } = require("../middlewares/validation");
const {
  userRegistrationSchema,
  userLoginSchema,
} = require("../schemas/userSchemas");
// const { auth } = require("../middleware/authMiddleware");

router.put("/register", validateData(userRegistrationSchema), registerUser);
router.post("/login", validateData(userLoginSchema), login);
router.post("/verifyOtp", verifyOtp);
// router.get("/me", auth, verifyToken);

module.exports = router;
