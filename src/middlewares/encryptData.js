const { AES } = require("crypto-js");
const CryptoJS = require("crypto-js");
const User = require("../models/Users");
const dotenv = require("dotenv");

dotenv.config();

const encUserData = (data) => {
  const encryptedData = AES.encrypt(
    JSON.stringify(data),
    process.env.NODE_SERVER_ENC_KEY
  ).toString();
  return encryptedData;
};
const decUserData = (encryptedData) => {
  const decryptedData = AES.decrypt(
    encryptedData,
    process.env.NODE_SERVER_ENC_KEY
  ).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

const encryptData = (data, id) => {
  const user = User.findById(id);
  const encryptedData = AES.encrypt(
    JSON.stringify(data),
    decUserData(user.password)
  ).toString();
  return encryptedData;
};

const decryptData = (encryptedData, id) => {
  const user = User.findById(id);
  const decryptedData = AES.decrypt(
    encryptedData,
    decUserData(user.password)
  ).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

module.exports = { encUserData, decUserData, encryptData, decryptData };
