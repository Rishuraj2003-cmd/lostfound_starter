import mongoose from 'mongoose';
const ReportSchema = new mongoose.Schema({
  type: { type: String, enum: ['LOST','FOUND'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  images: [String],
  geo: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], required: true } },
  address: String,
  city: String,
  status: { type: String, enum: ['OPEN','RESOLVED','HIDDEN'], default: 'OPEN' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contact: { email: String, phone: String }
}, { timestamps: true });
ReportSchema.index({ title: 'text', description: 'text' });
ReportSchema.index({ geo: '2dsphere' });
export default mongoose.model('Report', ReportSchema);