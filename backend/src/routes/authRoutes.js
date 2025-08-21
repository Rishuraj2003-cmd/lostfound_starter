
// src/routes/authRoutes.js
import { Router } from "express";
import passport from "passport";
import { register, login, me, verifyOtp, forgotPassword, resetPassword } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";
import { signAccess } from "../utils/tokens.js"; // ✅ needed

const r = Router();

// Local Auth
r.post("/register", register);
r.post("/login", login);

// Google Auth
r.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

r.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/signin`, session: false }),
  (req, res) => {
    const token = signAccess(req.user);
    const userData = encodeURIComponent(JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    }));
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userData}`);
  }
);

r.post("/reset-password/:token", resetPassword);
r.post("/forgot-password", forgotPassword);
// OTP Verification
r.post("/verify-otp", verifyOtp);

// Profile
r.get("/me", auth(true), me);

export default r;
