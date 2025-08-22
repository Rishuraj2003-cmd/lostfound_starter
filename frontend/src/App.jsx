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

export default function App() {
  const location = useLocation();

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
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}
