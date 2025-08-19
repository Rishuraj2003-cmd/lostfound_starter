import { Router } from 'express';
import { dashboard, listUsers } from '../controllers/adminController.js';
import { auth, requireRole } from '../middleware/auth.js';
const r = Router();
r.get('/dashboard', auth(true), requireRole('admin'), dashboard);
r.get('/users', auth(true), requireRole('admin'), listUsers);
export default r;