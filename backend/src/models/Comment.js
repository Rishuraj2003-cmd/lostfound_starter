import mongoose from 'mongoose';
const CommentSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: String
}, { timestamps: true });
export default mongoose.model('Comment', CommentSchema);