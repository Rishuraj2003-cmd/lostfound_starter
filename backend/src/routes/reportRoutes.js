import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../services/imageService.js';
import { createReport, listReports, getReport } from '../controllers/reportController.js';
const r = Router();
r.get('/', listReports);
r.get('/:id', getReport);
r.post('/', auth(true), upload.array('images',4), createReport);

export default r;