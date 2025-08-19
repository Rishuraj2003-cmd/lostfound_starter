import dotenv from "dotenv";
dotenv.config();
console.log("ENV check:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
});

// server.js
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import testRoute from "./routes/testRoutes.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,        // will be http://localhost:5173
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/api", testRoute);

// attach io so controllers can use req.io
app.use((req,res,next)=>{ req.io = io; next(); });

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running 🚀" });
});

io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('joinReport', (reportId) => {
    socket.join(`report:${reportId}`);
  });
});

const port = env.PORT;
await connectDB();
server.listen(port, ()=> console.log(`API running on http://localhost:${port}`));