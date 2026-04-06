import { Router } from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = Router();


// ==============================
// 🔹 CREATE / GET CONVERSATION
// ==============================
router.post("/conversation", auth(true), async (req, res) => {
  try {
    const { userId, reportId } = req.body;

    if (!userId || !reportId) {
      return res.status(400).json({ message: "Missing data" });
    }

    let convo = await Conversation.findOne({
      members: { $all: [req.user.id, userId] },
      reportId,
    });

    if (!convo) {
      convo = await Conversation.create({
        members: [req.user.id, userId],
        reportId,
      });
    }

    res.json(convo);
  } catch (err) {
    console.error("Conversation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 🔹 GET ALL CHATS
// ==============================
router.get("/", auth(true), async (req, res) => {
  try {
    const chats = await Conversation.find({
      members: req.user.id,
    })
      .populate("members", "name email")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error("Fetch chats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 🔹 GET MESSAGES
// ==============================
router.get("/messages/:id", auth(true), async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 🔹 SEND MESSAGE
// ==============================
router.post("/message", auth(true), async (req, res) => {
  try {
    const { conversationId, text, fileUrl, fileType } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "ConversationId required" });
    }

    if (!text && !fileUrl) {
      return res.status(400).json({ message: "Message empty" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const msg = await Message.create({
      conversationId,
      text: text || "",
      sender: req.user.id,
      senderName: user.name,
      fileUrl: fileUrl || null,
      fileType: fileType || null,
    });

    // 🔥 REALTIME MESSAGE
    if (req.io) {
      req.io.to(conversationId).emit("receiveMessage", msg);
    }

    res.json(msg);
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 🔹 MARK AS SEEN (BLUE TICK FIX)
// ==============================
router.put("/seen/:conversationId", auth(true), async (req, res) => {
  try {
    const { conversationId } = req.params;

    // ✅ update unseen messages (not sent by current user)
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: req.user.id },
        seen: false,
      },
      { seen: true }
    );

    // ✅ get updated messages
    const updatedMessages = await Message.find({
      conversationId,
      sender: { $ne: req.user.id },
    });

    // 🔥 EMIT SEEN EVENT (IMPORTANT)
    if (req.io) {
      req.io.to(conversationId).emit("messageSeen", {
        messageIds: updatedMessages.map((m) => m._id.toString()),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Seen update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
