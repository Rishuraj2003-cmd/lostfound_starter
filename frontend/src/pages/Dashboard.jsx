// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

function Loader() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
}

export default function Dashboard() {
  const [reports, setReports] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch user profile
    api.get("/auth/me")
      .then((res) => {
        // handle both { user: {...} } and {...} responses
        setUser(res.data.user || res.data);
      })
      .catch((err) => console.error("Error fetching user profile", err));

    // fetch user reports
    api.get("/users/dashboard")
      .then((res) => setReports(res.data.reports))
      .catch((err) => {
        console.error("Error loading my reports", err);
        setReports([]); // fallback
      });
  }, []);

  if (reports === null || !user) {
    return (
      <div className="container-page py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container-page py-8 space-y-8">
      {/* User Profile Section */}
      <div className="p-6 border rounded-lg shadow-sm bg-white">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          {user.createdAt && (
            <p>
              <span className="font-semibold">Joined:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Reports Section */}
      <div>
        <h1 className="text-2xl font-bold mb-4">My Reports</h1>

        {reports.length === 0 ? (
          <p className="text-gray-500">You haven't posted any reports yet.</p>
        ) : (
          <div className="grid gap-4">
            {reports.map((r) => (
              <div
                key={r._id}
                className="card p-4 border rounded-lg shadow-sm bg-white"
              >
                <h2 className="text-xl font-semibold">{r.title}</h2>
                <p className="text-sm text-gray-600">
                  {r.city} • {r.type}
                </p>
                <p className="mt-2">{r.description}</p>
                <div className="mt-2 flex gap-2">
                  {r.images?.slice(0, 3).map((img, i) => (
                    <img
                      key={i}
                      src={
                        img.startsWith("http")
                          ? img
                          : `${import.meta.env.VITE_API_URL?.replace(
                              "/api",
                              ""
                            )}/${img}`
                      }
                      alt="Report"
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
