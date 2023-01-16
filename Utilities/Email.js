const express = require('express');
const router = express.Router();
const emailValidator = require('email-validator');
var nodemailer = require('nodemailer');

async function sendVerificationMail(email ,uniqueString){

  console.log("point 1")

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "doritozz349@gmail.com", // generated ethereal user
        pass: "cfrqisetxhucnihv"  // generated ethereal password
    }
});

// setup email data with unicode symbols
var mailOptions = {
    from: '"Fred Foo 👻" <doritozz349@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    html: `press <a href=http://localhost:3000/verify/${uniqueString}>here</a> to verify!` // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}

 async function isEmailValid(email) {
  console.log(email)
  return emailValidator.validate(email)
}

module.exports = {isEmailValid, sendVerificationMail};




