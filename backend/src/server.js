import dotenv from "dotenv";
dotenv.config();
console.log("ENV check:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
});

// server.js
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import commentRoutes from "./routes/commentRoutes.js";  
import Visitor from './models/Visitor.js';
import userRoutes from "./routes/userRoutes.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL, // will be http://localhost:5173
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use("/api/users", userRoutes);

// attach io so controllers can use req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/comments", commentRoutes);   


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running 🚀" });
});

// Get current visitor count

app.get("/api/visitor", async (req, res) => {
  let visitor = await Visitor.findOne();
  if (!visitor) visitor = { count: 0 };
  res.json({ count: visitor.count });
});

// socket handling
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("joinReport", (reportId) => {
    socket.join(`report:${reportId}`);
    console.log(`User joined report:${reportId}`);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
  });
});


const port = env.PORT;
await connectDB();
server.listen(port, () =>
  console.log(`API running on http://localhost:${port}`)
);
