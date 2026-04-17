// frontend/src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Reports from "./pages/Reports.jsx";
import NewReport from "./pages/NewReport.jsx";
import ReportDetail from "./pages/ReportDetail.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard.jsx";
import Footer from "./components/Footer.jsx";
import { AnimatePresence, motion } from "framer-motion";
import MyReports from "./pages/MyReports";
import ChatRoom from "./pages/ChatRoom.jsx";
import ChatList from "./pages/ChatList.jsx";
import Chat from "./pages/Chat.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import { connectSocket, disconnectSocket, socket } from "./socket.js";
import { useEffect, useState } from "react";

export default function App() {
  const location = useLocation();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      connectSocket(userId);
    } else {
      disconnectSocket();
    }

    // Global listener for online users
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };
    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [location.pathname]);

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/about" element={<motion.div {...pageTransition}><About /></motion.div>} />
          <Route path="/contact" element={<motion.div {...pageTransition}><Contact /></motion.div>} />

          {/* Google OAuth Callback Route */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes with animation */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <Home />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <Reports />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/new"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <NewReport />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <ReportDetail />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <Dashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <MyReports />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <Chat globalOnlineUsers={onlineUsers} />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <Chat globalOnlineUsers={onlineUsers} />
                </motion.div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Hide Footer on chat pages for a true full-screen messenger experience */}
      {!location.pathname.startsWith('/chat') && <Footer />}
    </>
  );
}
