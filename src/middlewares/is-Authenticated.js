const jwt = require("jsonwebtoken");
const User = require("../src/models/Users");

exports.auth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.NODE_SERVER_JWT_SECRET);
    req.user = await User.findById(decodedToken.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
