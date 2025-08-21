
// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String }, // No longer required, for local auth only
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  contactPhone: String,
  
  // --- ADDED FOR NEW AUTH FLOW ---
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },

}, { timestamps: true });

export default mongoose.model('User', UserSchema);