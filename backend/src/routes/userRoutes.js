import { Router } from "express";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";
import Report from "../models/Report.js";

const r = Router();

// GET /api/users/dashboard
r.get("/dashboard", auth(true), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const reports = await Report.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ user, reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default r;
