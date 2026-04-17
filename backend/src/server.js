import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Visitor from "./models/Visitor.js";

export let ioInstance;

// ✅ CREATE SERVER
const server = http.createServer(app);

// ✅ SOCKET INIT
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

ioInstance = io;

// ✅ ONLINE USERS
const onlineUsers = new Map();

// ✅ ROUTES
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

// ✅ PASS SOCKET
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/chat", chatRoutes);

// ✅ HEALTH
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ✅ VISITOR
app.get("/api/visitor", async (req, res) => {
  let visitor = await Visitor.findOne();
  if (!visitor) {
    visitor = { count: 0 };
  }
  res.json({ count: visitor.count });
});

// =======================
// 🔥 SOCKET LOGIC
// =======================

io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  // USER ONLINE
  socket.on("joinUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // JOIN CHAT
  socket.on("joinChat", (conversationId) => {
    socket.join(conversationId);
    console.log("💬 Joined:", conversationId);
  });

  // TYPING
  socket.on("typing", ({ conversationId, userName }) => {
    socket.to(conversationId).emit("typing", userName);
  });

  socket.on("stopTyping", ({ conversationId }) => {
    socket.to(conversationId).emit("stopTyping");
  });

  // SEND MESSAGE
  socket.on("sendMessage", (msg) => {
    console.log("📩", msg);

    io.to(msg.conversationId).emit("receiveMessage", msg);

    if (msg.receiverId) {
      io.to(msg.receiverId).emit("receiveMessage", msg);
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

// =======================
// 🚀 START SERVER
// =======================

const port = env.PORT;

await connectDB();

server.listen(port, () => {
  console.log(`🚀 Running on http://localhost:${port}`);
});
