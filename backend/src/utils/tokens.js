import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Sign a 7-day access token with the user's role in the payload
export const signAccess = (user) =>
  jwt.sign(
    { role: user.role },
    env.JWT_SECRET,
    { subject: String(user._id), expiresIn: env.JWT_EXPIRE }
  );