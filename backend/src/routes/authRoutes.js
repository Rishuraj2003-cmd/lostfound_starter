// routes/authroutes

import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
const r = Router();
r.post('/register', register);
r.post('/login', login);
r.get('/me', auth(true), me);
export default r;