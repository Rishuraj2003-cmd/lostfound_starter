import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);