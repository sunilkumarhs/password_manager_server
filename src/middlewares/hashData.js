const bcrypt = require("bcryptjs");

exports.hashData = async (data) => {
  const salt = await bcrypt.genSalt(12);
  const hashedData = await bcrypt.hash(data, salt);
  return hashedData;
};
