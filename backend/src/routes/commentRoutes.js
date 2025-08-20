//src/routes/commentRoute.js

import { Router } from 'express';
import { createComment, listComments } from '../controllers/commentController.js';
import { auth } from '../middleware/auth.js';
const r = Router();
r.get('/:reportId', listComments);
r.post('/', auth(true), createComment);
export default r;
