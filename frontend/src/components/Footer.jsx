import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Search,
} from "lucide-react";

const SOCKET_URL =
 import.meta.env.VITE_API_URL?.replace("/api", "");

 const socket = io(SOCKET_URL);
 
export default function Footer() {
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/visitor`)
      .then((res) => res.json())
      .then((data) => setTotalVisitors(data.count))
      .catch(console.error);
  }, []);

  useEffect(() => {
    socket.on("visitorCount", setTotalVisitors);
    return () => socket.off("visitorCount");
  }, []);

  return (
    <footer className="bg-[#0B1220] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-5 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Search className="text-white size-5" />
            </div>
            <h2 className="text-white font-semibold">Lost & Found</h2>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Community-driven platform to find lost items easily.
          </p>

          <p className="text-sm">
            🌍 Visits: <span className="text-indigo-400">{totalVisitors}</span>
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white mb-3 text-sm font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/">All Reports</a></li>
            <li><a href="/my-reports">My Reports</a></li>
            <li><a href="/reports/new">Post Report</a></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white mb-3 text-sm font-semibold">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white mb-3 text-sm font-semibold">Contact</h3>
          <div className="space-y-2 text-sm">
            <p className="flex gap-2"><Mail size={14}/> lostandfound.portal@gmail.com</p>
            <p className="flex gap-2"><Phone size={14}/> +91 00000 00000</p>
            <p className="flex gap-2"><MapPin size={14}/> India</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Lost & Found • Built with ❤️ in India
      </div>
    </footer>
  );
}