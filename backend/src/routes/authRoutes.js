// routes/authroutes
/*
import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
const r = Router();
r.post('/register', register);
r.post('/login', login);
r.get('/me', auth(true), me);
export default r;
*/
// src/routes/authRoutes.js
import { Router } from "express";
import passport from "passport";
import { register, login, me, verifyOtp } from "../controllers/authController.js";
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


// OTP Verification
r.post("/verify-otp", verifyOtp);

// Profile
r.get("/me", auth(true), me);

export default r;
