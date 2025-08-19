import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function auth(required = true){
  return (req,res,next)=>{
    const token = req.cookies?.accessToken || (req.headers.authorization?.split(' ')[1]);
    if(!token) {
      if(required) return res.status(401).json({ message: 'Unauthenticated' });
      return next();
    }
    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = { id: payload.sub, role: payload.role };
      next();
    } catch (err){
      if(required) return res.status(401).json({ message: 'Invalid token' });
      next();
    }
  };
}
export function requireRole(role){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if(req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}