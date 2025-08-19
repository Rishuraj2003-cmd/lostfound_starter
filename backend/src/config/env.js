import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,

  // ✅ align with your .env
  JWT_SECRET: process.env.JWT_SECRET || 'devsecret',

  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SMTP_HOST: process.env.EMAIL_HOST,
  SMTP_PORT: process.env.EMAIL_PORT,
  SMTP_USER: process.env.EMAIL_USER,
  SMTP_PASS: process.env.EMAIL_PASS,
  CLOUDINARY_CLOUD: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET
};
