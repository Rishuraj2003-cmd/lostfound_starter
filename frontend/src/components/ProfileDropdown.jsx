import { useState, useEffect } from "react";
import axios from "axios";

const ProfileDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [dashboard, setDashboard] = useState({ user: null, reports: [] });
  const [loading, setLoading] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    if (!open || !user) return; // only fetch if dropdown opens and user exists

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/users/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDashboard(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchDashboard();
  }, [open, user]);

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative">
      <div
        onClick={toggleDropdown}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer"
      >
        {firstLetter}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-4 z-50">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h4>{dashboard.user?.name || "User"}</h4>
              <p>Email: {dashboard.user?.email || "-"}</p>
              <h5>Your Reports:</h5>
              {dashboard.reports.length === 0 ? (
                <p>No reports posted yet.</p>
              ) : (
                <ul className="max-h-40 overflow-y-auto">
                  {dashboard.reports.map((report) => (
                    <li key={report._id}>{report.title}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
