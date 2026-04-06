# 🕵️ Lost & Found – Backend (Node/Express + MongoDB)

Backend API for a **Lost & Found** app. Handles auth (email/password + Google OAuth + OTP verification), reports (lost/found), comments, image uploads (Cloudinary), and realtime updates (Socket.IO).

---

## ✨ Features
- 🔑 Local login + **Google OAuth 2.0**
- ✅ **OTP email verification** & password reset
- 🧾 Lost/Found **reports** with image upload (Cloudinary)
- 💬 **Comments** with realtime broadcast to report rooms
- 📡 **Socket.IO** events (comments + visitor count)
- 🔍 Search, filters, pagination
- 🛡 JWT auth middleware, role guard (admin hooks ready)

---

## 🗂 Project Structure

lost-found-backend/
├── src/
│ ├── app.js
│ ├── server.js
│ ├── config/
│ │ ├── db.js
│ │ ├── env.js
│ │ ├── passport.js
│ │ └── cloudinary.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── reportController.js
│ │ ├── commentController.js
│ │ ├── userController.js
│ │ └── adminController.js (future)
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ ├── errorMiddleware.js
│ │ └── uploadMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Report.js
│ │ ├── Comment.js
│ │ ├── Notification.js
│ │ └── Visitor.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── reportRoutes.js
│ │ ├── commentRoutes.js
│ │ └── userRoutes.js
│ ├── services/
│ │ ├── imageService.js
│ │ └── matchService.js
│ └── utils/
│ ├── generateOtp.js
│ ├── sendEmail.js
│ └── tokens.js
├── .env (not committed, local only)
├── package.json
└── README.md