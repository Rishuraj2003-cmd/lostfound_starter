import Comment from '../models/Comment.js';
import Report from '../models/Report.js';

export async function createComment(req,res){
  const { reportId, body } = req.body;
  const comment = await Comment.create({ reportId, body, authorId: req.user?.id });
  // emit to report room
  if(req.io) req.io.to(`report:${reportId}`).emit('comment:new', comment);
  // optional: notify report owner
  const report = await Report.findById(reportId);
  if(report && report.postedBy && req.io) req.io.to(`user:${report.postedBy}`).emit('notification', { type:'COMMENT', reportId, comment });
  res.status(201).json(comment);
}

export async function listComments(req,res){
  const comments = await Comment.find({ reportId: req.params.reportId }).sort({ createdAt: 1 }).populate('authorId','name');
  res.json(comments);
}