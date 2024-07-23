const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("No token, authorization denied");
    error.statusCode = 401;
    throw error;
  }
  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.NODE_SERVER_JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
