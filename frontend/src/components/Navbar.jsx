// components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <Link to="/" className="font-bold text-xl">Lost & Found</Link>
      <div className="space-x-4">
        <Link to="/reports/new" className="hover:underline ">➕ Post Report</Link>
        <Link to="/reports" className="hover:underline">📋 All Reports</Link>
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
            <button 
              onClick={logout} 
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/signin" className="text-blue-500">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
