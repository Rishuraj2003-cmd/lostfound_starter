import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Sign a 7-day access token with the user's role in the payload
export const signAccess = (user) =>
  jwt.sign(
    { 
      sub:user._id,
      role: user.role,
      name: user.name,
     },
    env.JWT_SECRET,
    { 
      expiresIn: env.JWT_EXPIRE 
    }
  );