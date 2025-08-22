import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import Report from "../models/Report.js";
import { upload } from '../services/imageService.js';
import { createReport, listReports, getReport } from '../controllers/reportController.js';
const r = Router();
r.get('/', listReports);
r.get('/:id', getReport);
r.post('/', auth(true), upload.array('images',4), createReport);

r.get("/my", auth(true), async (req, res) => {
    try {
      const reports = await Report.find({ postedBy: req.user._id })
        .sort({ createdAt: -1 });
      res.json(reports);
    } catch (err) {
      console.error("Error fetching my reports:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
export default r;