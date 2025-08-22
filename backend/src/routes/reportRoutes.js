import { Router } from "express";
import Report from "../models/Report.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../services/imageService.js";
import {
  createReport,
  listReports,
  getReport,
} from "../controllers/reportController.js";

const r = Router();

// Get all reports
r.get("/", listReports);

// Get a single report by ID
r.get("/:id", getReport);

// Create a new report (with up to 4 images)
r.post("/", auth(true), upload.array("images", 4), createReport);

// Get reports posted by the logged-in user
r.get("/my", auth(true), async (req, res) => {
  try {
    // FIX ✅ use 'user' field instead of 'postedBy'
    const reports = await Report.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(reports);
  } catch (err) {
    console.error("Error fetching my reports:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default r;
