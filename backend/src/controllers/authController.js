
// src/controllers/authController.js
import crypto from "crypto";
import Visitor from "../models/Visitor.js"; // your visitor model
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signAccess } from '../utils/tokens.js';
import { generateOtp } from '../utils/generateOtp.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

// --- HELPER FUNCTION ---
async function sendVerificationOtp(user) {
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    user.isVerified = false; // Ensure user is marked as unverified until OTP is correct
    await user.save();
    await sendOtpEmail(user.email, otp);
}

// --- MODIFIED: REGISTER ---
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already used" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });

    await sendVerificationOtp(user); // This will save the user and send OTP

    res.status(201).json({
      message: 'Registration successful! An OTP has been sent to your email for verification.',
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// --- MODIFIED: LOGIN ---
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  // NEW: Check if user is verified
  if (!user.isVerified) {
    await sendVerificationOtp(user);
    return res.status(403).json({
      message: 'Your account is not verified. A new OTP has been sent to your email.',
      needsVerification: true,
      email: user.email,
    });
  }

   // --- NEW: Increment visitor count on successful login ---
   let visitor = await Visitor.findOne();
   if (!visitor) {
     visitor = new Visitor({ count: 0 });
   }
   visitor.count += 1;
   await visitor.save();
 
   // Emit the updated count to all connected clients via socket
   if (req.io) {
     req.io.emit("visitorCount", visitor.count);
   }


  const token = signAccess(user);
  res.cookie("accessToken", token, { httpOnly: true, sameSite: "lax" });
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
    visitorCount: visitor.count,
  });
}

// --- NEW: GOOGLE OAUTH CALLBACK ---
// src/controllers/authController.js

// ... your other imports like User, signAccess, etc.
// --- FIXED GOOGLE OAUTH CALLBACK ---
export const handleGoogleCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=google-auth-failed`);
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const token = signAccess(user);
    const userData = encodeURIComponent(
      JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    // ✅ Use CLIENT_URL
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userData}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/signin?error=server-error`);
  }
};



// --- NEW: VERIFY OTP ---
export async function verifyOtp(req, res) {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = signAccess(user);
        res.cookie("accessToken", token, { httpOnly: true, sameSite: "lax" });
        res.json({
            message: 'Account verified successfully.',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
}

// --- FORGOT PASSWORD ---
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // avoid leaking which emails exist if you prefer:
      // return res.json({ message: "If the email exists, a reset link was sent." });
      return res.status(404).json({ message: "No account found with that email" });
    }

    // Create token valid for 1 hour
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password.</p>
        <p><a href="${resetUrl}">Click here</a> to set a new password. The link expires in 1 hour.</p>
      `,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error during forgot password" });
  }
}

// --- RESET PASSWORD ---
export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error during reset password" });
  }
}

// ME (no changes)
// --- FIXED: ME ---
export async function me(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Fetch full user details from DB
    const user = await User.findById(req.user.id).select("name email _id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
}
