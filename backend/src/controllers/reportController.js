// src/controllers/reportController.js

import Report from '../models/Report.js';
import { createReportService } from "../services/reportService.js";
import { getReportService } from "../services/reportService.js";
import { createReportSchema } from "../validators/reportValidator.js";
import { claimReportService } from "../services/reportService.js";

export async function createReport(req, res) {
  try {
    // ✅ STEP 1: Validate request
    const { error } = createReportSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    // ✅ STEP 2: Extract data
    const { type, title, description, category, lng, lat, address, city, contact } = req.body;

    const images = (req.files || []).map(f => f.path);

    const data = {
      type,
      title,
      description,
      category,
      images,
      geo: { type: 'Point', coordinates: [Number(lng || 0), Number(lat || 0)] },
      address,
      city,
      contact
    };

    // ✅ STEP 3: Call service
    const { report, matches } = await createReportService(data, req.user, req.io);

    res.status(201).json({ report, matches });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating report" });
  }
}

// ✅ LIST REPORTS (unchanged)
export async function listReports(req, res) {
  try {
    const { q, category, type, city, status, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (city) filter.city = city;
    if (status) filter.status = status.toUpperCase();
    if (q) filter.$text = { $search: q };

    // DATE FILTER
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
    const oldDate = new Date();
    oldDate.setMonth(now.getMonth() - 1);
    filter.createdAt = { $lt: oldDate };
  } else if (startDate) {
    filter.createdAt = { $gte: startDate };
  }
}

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Report.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
}

// ✅ GET SINGLE REPORT (unchanged)
export async function getReport(req, res) {
  try {
    const report = await getReportService(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
}

export async function claimReport(req, res) {
  try {
    const report = await claimReportService(req.params.id, req.user.id);

    res.json({
      message: "Item claimed successfully",
      report
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// 🔥 UPDATE STATUS
export async function updateStatus(req, res) {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    // ✅ OWNER CHECK
    if (report.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    report.status = req.body.status;
    await report.save();

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
}

// 🔥 DELETE
export async function deleteReport(req, res) {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    if (report.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await report.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
}

export async function editReport(req, res) {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ message: "Not found" });

    // OWNER CHECK
    if (report.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // UPDATE
    report.title = req.body.title || report.title;
    report.description = req.body.description || report.description;
    report.city = req.body.city || report.city;

    // 🔥 IMAGE UPDATE
    if (req.files && req.files.length > 0) {
      report.images = req.files.map(f => f.path);
    }

    await report.save();

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating" });
  }
}