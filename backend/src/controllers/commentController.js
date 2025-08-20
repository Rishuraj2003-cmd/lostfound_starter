import Comment from '../models/Comment.js';
import Report from '../models/Report.js';

export async function createComment(req, res) {
  try {
    const { reportId, body } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "Login required" });
    }

    const comment = await Comment.create({
      report: reportId,
      body,
      author: req.user.id   // ✅ use "author"
    });

    // Populate author name for frontend immediately
    const populated = await comment.populate("author", "name");

    // emit to report room (so realtime works)
    if (req.io) {
      req.io.to(`report:${reportId}`).emit("comment:new", populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Server error while creating comment" });
  }
}

export async function listComments(req, res) {
  const comments = await Comment.find({ report: req.params.reportId })
    .sort({ createdAt: 1 })
    .populate("author", "name");
  res.json(comments);
}
