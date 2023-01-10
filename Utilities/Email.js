const express = require('express');
const router = express.Router();
const emailValidator = require('email-validator');

 async function isEmailValid(email) {
  return await emailValidator.validate(email)
}

module.exports = {isEmailValid};


