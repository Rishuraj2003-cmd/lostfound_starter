import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Plus, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();

  // ✅ OUTSIDE CLICK CLOSE
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold">
              FI
            </div>
            <span className="font-semibold text-lg text-gray-800">FindIt</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-indigo-600 transition">
              All Reports
            </Link>

            <Link to="/dashboard" className="hover:text-indigo-600 transition">
              Dashboard
            </Link>

            <Link to="/about" className="hover:text-indigo-600 transition">
              About
            </Link>

            <Link to="/contact" className="hover:text-indigo-600 transition">
              Contact
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <span className="text-sm font-medium">Chat</span>
            </Link>

            <Link
              to="/reports/new"
              className="flex items-center gap-1 text-indigo-600 font-semibold"
            >
              <Plus size={16} />
              Post
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 relative">
            {/* USER AVATAR */}
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow hover:scale-105 transition"
                >
                  {user.name?.charAt(0).toUpperCase() || <User size={18} />}
                </button>

                {/* DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border p-3 text-sm z-50 animate-fadeIn">
                    {/* USER INFO */}
                    <div className="pb-2 border-b">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>

                    {/* LINKS */}
                    <div className="mt-2 flex flex-col gap-1">
                      <Link
                        to="/my-reports"
                        onClick={() => setProfileOpen(false)}
                        className="px-3 py-2 rounded hover:bg-gray-100 transition"
                      >
                        My Reports
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="px-3 py-2 rounded hover:bg-gray-100 transition"
                      >
                        Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="px-3 py-2 text-left text-red-500 hover:bg-red-50 rounded transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button onClick={() => setOpen(true)} className="md:hidden p-2">
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {open && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          {/* DRAWER */}
          <div className="fixed left-0 top-0 h-full w-[75%] bg-white p-5 z-50 shadow-lg">
            <button onClick={() => setOpen(false)} className="mb-4">
              <X />
            </button>

            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link to="/" onClick={() => setOpen(false)}>
                All Reports
              </Link>

              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>

              <Link to="/reports/new" onClick={() => setOpen(false)}>
                Post Report
              </Link>

              <Link to="/about" onClick={() => setOpen(false)}>
                About
              </Link>

              <Link to="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
              <Link to="/chat" onClick={() => setOpen(false)}>
                Chat
              </Link>
            </div>

            {/* USER INFO */}
            {user && (
              <div className="mt-10 pt-6 border-t">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>

                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-red-500 mt-3"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
