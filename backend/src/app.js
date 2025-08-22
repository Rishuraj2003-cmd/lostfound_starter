
// src/app.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import passport from 'passport';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; 
import commentRoutes from './routes/commentRoutes.js';
import './config/passport.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());



// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes); 
app.use('/api/comments', commentRoutes);
app.use('/uploads', express.static('uploads'));
// ... your errorHandler and other code

export default app;