// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600">Loading...</p>
    </div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
