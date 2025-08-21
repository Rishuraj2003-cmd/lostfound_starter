
// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";

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

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Google OAuth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/reports/new" element={<ProtectedRoute><NewReport /></ProtectedRoute>} />
        <Route path="/reports/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
