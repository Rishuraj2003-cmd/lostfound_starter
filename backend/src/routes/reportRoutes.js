import { Router } from "express";
import Report from "../models/Report.js";
import { auth } from "../middleware/auth.js"; 
import { upload } from "../services/imageService.js";
import {
  createReport,
  listReports,
  getReport,
  claimReport,
  updateStatus,
  deleteReport,
  editReport
} from "../controllers/reportController.js";

const r = Router();

// Public routes
r.get("/", listReports);

// ✅ MY ROUTE (FIRST)
r.get("/my", auth(true), async (req, res) => {
  try {
    console.log("Token user:", req.user.id);

    const { status, type, city, q } = req.query;

    const filter = { postedBy: req.user.id };

    if (status) {
      filter.status = status.toUpperCase();
    }

    if (type) {
      filter.type = type;
    }

    if (city) {
      filter.city = city;
    }

    // 🔥 THIS IS MISSING IN YOUR CODE
    if (q) {
      filter.$text = { $search: q };
    }
    // ✅ DATE FILTER
if (req.query.date) {
  const now = new Date();
  let startDate;

  if (req.query.date === "today") {
    startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
  }

  if (req.query.date === "week") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
  }

  if (req.query.date === "month") {
    startDate = new Date();
    startDate.setMonth(now.getMonth() - 1);
  }

  if (req.query.date === "older") {
    filter.createdAt = {
      $lt: new Date(new Date().setMonth(now.getMonth() - 1)),
    };
  } else if (startDate) {
    filter.createdAt = { $gte: startDate };
  }
}

    const reports = await Report.find(filter).sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (err) {
    console.error("Error fetching my reports:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ❗ Dynamic route ALWAYS last
r.get("/:id", getReport);

// Protected routes
r.post("/", auth(true), upload.array("images", 4), createReport);
r.put("/:id/claim", auth(true), claimReport);
r.put("/:id/status", auth(true), updateStatus);
r.delete("/:id", auth(true), deleteReport);
r.put("/:id", auth(true), upload.array("images", 4), editReport);
export default r;