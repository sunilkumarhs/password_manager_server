const { z } = require("zod");
const { emailRegex, passwordRegex } = require("../utils/constants");

const userRegistrationSchema = z.object({
  email: z.string().regex(emailRegex, {
    message: "Invalid email addresss",
  }),
  password: z.string().regex(passwordRegex, {
    message:
      "Your password must contain aleast one uppercase, lowercase, special and number characters",
  }),
  reminder: z.string(),
});

const userLoginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(12),
});

module.exports = { userRegistrationSchema, userLoginSchema };
