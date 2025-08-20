// src/utils/sendEmail.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"Your App Name" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Your Account Verification Code',
        text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
};