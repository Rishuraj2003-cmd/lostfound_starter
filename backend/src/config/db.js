import mongoose from 'mongoose';
import { env } from './env.js';
export async function connectDB(){
  if(!env.MONGO_URI) console.warn('MONGO_URI not set — connect will fail until configured.');
  await mongoose.connect(env.MONGO_URI || 'mongodb://127.0.0.1:27017/lostfound');
  console.log('MongoDB connected');
}