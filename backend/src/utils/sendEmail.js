// src/utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // lostandfound.portal@gmail.com
    pass: process.env.EMAIL_PASS,   // App password
  },
});

/**
 * Generic email sender
 */
export const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `"Lost and Found Portal" <${process.env.EMAIL_USER}>`, // ✅ Professional name
    to,
    subject,
    text,
    html,
  };
  await transporter.sendMail(mailOptions);
};

/**
 * OTP specific
 */
export const sendOtpEmail = async (to, otp) => {
  const subject = "Lost and Found - Account Verification Code";
  const text = `Your verification code is ${otp}. It will expire in 10 minutes.`;
  const html = `<p>Your verification code is: <b>${otp}</b></p>
                <p>This code will expire in 10 minutes.</p>`;

  await sendEmail(to, subject, text, html);
};
