import Report from "../models/Report.js";
import {
  createReportService,
  getReportService,
  claimReportService,
} from "../services/reportService.js";
import { createReportSchema } from "../validators/reportValidator.js";

// =======================
// ✅ CREATE REPORT
// =======================
export async function createReport(req, res) {
  console.log("🔥 API HIT HO RAHI HAI");

  try {
   console.log("BODY:", JSON.stringify(req.body, null, 2));
console.log("USER:", JSON.stringify(req.user, null, 2));
console.log("FILES:", req.files);


    const { error } = createReportSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const { type, title, description, category, lng, lat, address, city, contact } = req.body;

    const images = (req.files || []).map(f => f.path);

    const data = {
      type,
      title,
      description,
      category,
      images,
      geo: {
        type: "Point",
        coordinates: [Number(lng || 0), Number(lat || 0)]
      },
      address,
      city,
      contact
    };

    const { report, matches } = await createReportService(data, req.user, req.io);

    res.status(201).json({ report, matches });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: "Error creating report" });
  }
}

// =======================
// ✅ LIST REPORTS
// =======================
export async function listReports(req, res) {
  try {
    const {
      q,
      category,
      type,
      city,
      status,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (city) filter.city = city;
    if (status) filter.status = status.toUpperCase();
    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Report.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
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

// =======================
// ✅ GET SINGLE REPORT
// =======================
export async function getReport(req, res) {
  try {
    const report = await getReportService(req.params.id);
    res.json(report);
  } catch {
    res.status(404).json({ message: "Not found" });
  }
}

// =======================
// ✅ CLAIM REPORT
// =======================
export async function claimReport(req, res) {
  try {
    const report = await claimReportService(
      req.params.id,
      req.user._id || req.user.id
    );

    res.json({
      message: "Item claimed successfully",
      report,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// =======================
// 🔥 UPDATE STATUS
// =======================
export async function updateStatus(req, res) {
  try {
    const report = await Report.findById(req.params.id);

    if (!report)
      return res.status(404).json({ message: "Not found" });

    if (
      report.postedBy.toString() !==
      (req.user._id || req.user.id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    report.status = req.body.status;
    await report.save();

    res.json(report);
  } catch {
    res.status(500).json({ message: "Error updating status" });
  }
}

// =======================
// 🔥 DELETE REPORT
// =======================
export async function deleteReport(req, res) {
  try {
    const report = await Report.findById(req.params.id);

    if (!report)
      return res.status(404).json({ message: "Not found" });

    if (
      report.postedBy.toString() !==
      (req.user._id || req.user.id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await report.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting" });
  }
}

// =======================
// 🔥 EDIT REPORT
// =======================
export async function editReport(req, res) {
  try {
    const report = await Report.findById(req.params.id);

    if (!report)
      return res.status(404).json({ message: "Not found" });

    if (
      report.postedBy.toString() !==
      (req.user._id || req.user.id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    report.title = req.body.title || report.title;
    report.description =
      req.body.description || report.description;
    report.city = req.body.city || report.city;

    if (req.files && req.files.length > 0) {
      report.images = req.files.map(
        (f) => f.path || f.url
      );
    }

    await report.save();

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating" });
  }
}
