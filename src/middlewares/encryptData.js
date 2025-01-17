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
  const secKey = process.env.NODE_SERVER_ENC_KEY + id;
  const encryptedData = AES.encrypt(JSON.stringify(data), secKey).toString();
  return encryptedData;
};

const decryptData = (encryptedData, id) => {
  const secKey = process.env.NODE_SERVER_ENC_KEY + id;
  const decryptedData = AES.decrypt(encryptedData, id).toString(
    CryptoJS.enc.Utf8
  );
  return JSON.parse(decryptedData);
};

module.exports = { encUserData, decUserData, encryptData, decryptData };
