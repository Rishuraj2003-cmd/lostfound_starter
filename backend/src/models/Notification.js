import mongoose from 'mongoose';
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  data: mongoose.Schema.Types.Mixed,
  readAt: Date
}, { timestamps: true });
export default mongoose.model('Notification', NotificationSchema);