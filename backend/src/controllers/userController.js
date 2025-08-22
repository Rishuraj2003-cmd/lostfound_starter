// src/controllers/userController.js
import User from "../models/User.js";
import Report from "../models/Report.js";

export async function getUserDashboard(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const reports = await Report.find({ postedBy: req.user.id }).sort({ createdAt: -1 });

    res.json({ user, reports });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
