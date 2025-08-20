
/*
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { signAccess } from '../utils/tokens.js';

// REGISTER
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already used" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = signAccess(user);

    // cookie (optional if you want browser-only auth)
    res.cookie("accessToken", token, { httpOnly: true, sameSite: "lax" });

    // response body (needed for Postman/frontend)
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token   // 👈 now client can see and save it
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// LOGIN
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signAccess(user);

  // cookie (browser sessions)
  res.cookie("accessToken", token, { httpOnly: true, sameSite: "lax" });

  // response body
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token   // 👈 this was missing earlier
  });
}

// ME
export function me(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  res.json({ user: { id: req.user.id, role: req.user.role } });
}
*/
// src/controllers/authController.js
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

  const token = signAccess(user);
  res.cookie("accessToken", token, { httpOnly: true, sameSite: "lax" });
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
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


// ME (no changes)
export function me(req, res) {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  res.json({ user: { id: req.user.id, role: req.user.role } });
}