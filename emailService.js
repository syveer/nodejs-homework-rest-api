const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // sau alt serviciu de email
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email address",
    text: `Click this link to verify your email: http://localhost:3000/users/verify/${token}`,
    html: `Click this <a href="http://localhost:3000/users/verify/${token}">link</a> to verify your email.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
