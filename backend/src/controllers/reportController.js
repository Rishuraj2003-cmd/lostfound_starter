// src/controllers/reportController.js
import Report from '../models/Report.js';
import { findPotentialMatches } from '../services/matchService.js';

// src/controllers/reportController.js
export async function createReport(req, res) {
  const { type, title, description, category, lng, lat, address, city, contact } = req.body;

  // ✅ Cloudinary gives secure URLs in file.path
  const images = (req.files || []).map(f => f.path);

  const report = await Report.create({
    type,
    title,
    description,
    category,
    images,
    geo: { type: 'Point', coordinates: [Number(lng || 0), Number(lat || 0)] },
    address,
    city,
    contact,
    postedBy: req.user?.id
  });

  const matches = await findPotentialMatches(report).catch(() => []);

  if (req.io && report.postedBy) {
    req.io.to(`user:${report.postedBy}`).emit('report:created', report);
  }

  res.status(201).json({ report, matches });
}

export async function listReports(req, res) {
  const { q, category, type, city, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (city) filter.city = city;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Report.countDocuments(filter)
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit))
  });
}

export async function getReport(req, res) {
  const rep = await Report.findById(req.params.id).populate('postedBy', 'name email');
  if (!rep) return res.status(404).json({ message: 'Not found' });
  res.json(rep);
}
