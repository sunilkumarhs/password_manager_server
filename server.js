const express = require("express");
const connectDB = require("./src/config/database");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/auth");
const passRoutes = require("./src/routes/passwords");
const cardRoutes = require("./src/routes/cards");
const noteRoutes = require("./src/routes/notes");
const bankRoutes = require("./src/routes/banks");

dotenv.config();

const app = express();
// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/securepass_server", authRoutes);
app.use("/secure_pass", passRoutes);
app.use("/secure_passCards", cardRoutes);
app.use("/secure_passNotes", noteRoutes);
app.use("/secure_passBanks", bankRoutes);
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
