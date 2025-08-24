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
```
lost-found-backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   ├── passport.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   ├── commentController.js
│   │   ├── userController.js
│   │   └── adminController.js (future)
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Report.js
│   │   ├── Comment.js
│   │   ├── Notification.js
│   │   └── Visitor.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── commentRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── imageService.js
│   │   └── matchService.js
│   └── utils/
│       ├── generateOtp.js
│       ├── sendEmail.js
│       └── tokens.js
├── .env (not committed, local only)
└── package.json
```

## 🔧 Requirements
- Node.js 18+  
- MongoDB Atlas (or local)  
- Cloudinary account (for images)  
- Gmail (app password) or SMTP creds for emails  
- Google Cloud OAuth client (Web app)

## ⚙️ Environment Variables
Create a `.env` in the project root:

```env
# App
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Email (using Gmail app password or your SMTP)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


```
✅ server.js logs whether Cloudinary keys loaded.

✅ CLIENT_URL must match your frontend origin (for CORS + redirects).

## 🚀 Run Locally

Clone the project:
```bash
git clone https://github.com/your-username/lost-found-backend.git
cd lost-found-backend
```
Install dependencies:
```bash
npm install
```

Start the server:

```bash
npm run dev   # for development
npm start     # for production
```

Backend will run on:

👉 [http://localhost:5000](http://localhost:5000)


## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- Passport.js (Google OAuth2)
- JWT
- Cloudinary
- Socket.IO

## 

 ### 🗝️ Setup Notes (Once)
 
 MongoDB Atlas: create project → Database → get connection string and put in ```MONGO_URI```.

 Google OAuth: Google Cloud Console → Credentials → OAuth client (Web).
   - Authorized redirect URI → ```http://localhost:5000/api/auth/google/callback``` (change in prod).
     
     **Cloudinary**: copy cloud name, API key/secret to ```.env```.

     **Email:** if Gmail, enable 2FA and create an **App Password**, use as ```EMAIL_PASS```.

##

# 🕵️ Lost & Found – Frontend 

This is the **frontend web app** for the Lost & Found system.  
It provides an interface for users to create lost/found reports, verify email, comment in real-time, and browse reports.

---

## ✨ Features

- 🔐 User Authentication (Local + Google OAuth2)
- ✅ Email OTP verification
- 📝 Create Lost/Found reports with image upload
- 💬 Real-time comments on reports
- 📊 Search, filter, and pagination for reports
- 🌐 Responsive UI (React + Tailwind)

---

## 📂 Project Structure

```bash
lost-found-frontend/
├── index.html
├── src
│   ├── api
│   │   └── client.js
│   ├── App.jsx
│   ├── components
│   │   ├── auth
│   │   │   ├── GoogleLogin.jsx
│   │   │   ├── LocalLogin.jsx
│   │   │   ├── LocalRegister.jsx
│   │   │   └── PasswordInput.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProfileDropdown.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ReportCard.jsx
│   ├── context
│   │   └── AuthContext.jsx
│   ├── index.jsx
│   ├── pages    
│   │   ├── AuthCallback.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── NewReport.jsx
│   │   ├── OtpVerify.jsx
│   │   ├── ReportDetail.jsx
│   │   ├── Reports.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   └── styles
│       └── tailwind.css
├── .env
├── tailwind.config.js
└── vite.config.mjs

```


## 🚀 Run Locally
Clone the project:
```bash
git clone https://github.com/your-username/lost-found-frontend.git
cd lost-found-frontend
```
Install dependencies:
``bash
npm install
```
Set up environment variables:
```env
VITE_API_URL=http://localhost:5000
```
Run the app:
```bash
npm run dev
```

Frontend will run on:

👉 [http://localhost:5173](http://localhost:5173)

___
**🛠️ Tech Stack**
- React.js
- Vite
- TailwindCSS
- Axios
- JWT
- React Router
- Socket.IO Client



##

## 👤 Author

### Rishu Raj

##
