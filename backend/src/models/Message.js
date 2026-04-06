import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderName: {
      type: String,
      required: true, // 🔥 IMPORTANT
    },

    text: {
      type: String,
      default: "",
    },

    // ✅ Seen (basic)
    seen: {
      type: Boolean,
      default: false,
    },

    // ✅ ADVANCED (future ready)
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ FILE SUPPORT
    fileUrl: {
      type: String,
      default: null,
    },

    fileType: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
