const { z } = require("zod");

const SiteFormSchema = z.object({
  website: z.string().url(),
  name: z.string(),
  folder: z.string(),
  userName: z.string().min(5, {
    message: "UserName must be atleast 5 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be atleast 5 characters.",
  }),
  notes: z.string(),
});

const NotesFormSchema = z.object({
  name: z.string().min(5, { message: "Name must be atleast 5 characters." }),
  folder: z.string(),
  notes: z.string().min(5, { message: "Notes must be atleast 5 characters." }),
});

const CardFormSchema = z.object({
  name: z.string(),
  folder: z.string(),
  cardName: z.string().min(5, {
    message: "Name in Card must be atleast 5 characters.",
  }),
  type: z.string().min(5, {
    message: "Type of Card must be atleast 5 characters.",
  }),
  cardNumber: z.string().length(16, {
    message: "CardNumber must be valid 16 digit",
  }),
  cvvCode: z.string().length(3, { message: "CVV code must be 3 digit" }),
  startDate: z.string(),
  startYear: z.string().max(4, {
    message: "Year must be of 4 digit",
  }),
  endDate: z.string().min(2, { message: "Select the Expiery Date of Card" }),
  endYear: z.string().length(4, {
    message: "Year must be of 4 digit",
  }),
  notes: z.string(),
});

const BankFormSchema = z.object({
  name: z.string(),
  folder: z.string(),
  bankName: z.string().min(5, {
    message: "Bank Name must be atleast 5 characters.",
  }),
  accType: z.string().min(5, {
    message: "Account Type must be atleast 5 characters.",
  }),
  accNumber: z.string().length(11, {
    message: "Account Number must be valid 11 digit",
  }),
  IFSCCode: z
    .string()
    .length(11, { message: "IFSC Code must be valid 11 digit" }),
  branchCode: z.string(),
  branchPhone: z.string(),
  notes: z.string(),
});

module.exports = {
  SiteFormSchema,
  NotesFormSchema,
  CardFormSchema,
  BankFormSchema,
};
