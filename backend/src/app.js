//app.js
/*
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/error.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
*/
// src/app.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import passport from 'passport';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js'; // <-- 1. ADD THIS IMPORT

// Import passport config to execute it
import './config/passport.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport middleware
app.use(passport.initialize());

app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes); // <-- 2. ADD THIS LINE

// ... your errorHandler and other code

export default app;