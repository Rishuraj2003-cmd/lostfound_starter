import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userRes = await api.get("/auth/me");
        const reportRes = await api.get("/users/dashboard");

        setUser(userRes.data.user || userRes.data);
        setReports(reportRes.data.reports || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔥 STATS
  const stats = {
    total: reports.length,
    open: reports.filter((r) => r.status === "OPEN").length,
    claimed: reports.filter((r) => r.status === "CLAIMED").length,
    resolved: reports.filter((r) => r.status === "RESOLVED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 🔥 PROFILE */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-full text-lg font-bold">
              {user.name?.[0]}
            </div>

            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <Link
            to="/reports/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Post
          </Link>
        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat title="Total" value={stats.total} />
        <Stat title="Open" value={stats.open} color="green" />
        <Stat title="Claimed" value={stats.claimed} color="yellow" />
        <Stat title="Resolved" value={stats.resolved} color="gray" />
      </div>

      {/* 🔥 REPORTS */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">No reports yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {reports.slice(0, 4).map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full"
              >
                {/* IMAGE */}
                <img
                  src={
                    r.images?.[0]?.startsWith("http")
                      ? r.images[0]
                      : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/${r.images?.[0]}`
                  }
                  className="w-full h-48 object-cover"
                />

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {r.title}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {r.city} • {r.type}
                  </p>

                  {/* STATUS */}
                  <span
                    className={`text-xs px-2 py-1 rounded mt-1 w-fit ${
                      r.status === "OPEN"
                        ? "bg-green-100 text-green-600"
                        : r.status === "CLAIMED"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {r.status}
                  </span>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {r.description}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-auto pt-3 flex gap-2">
                    <Link
                      to={`/reports/${r._id}`}
                      className="flex-1 text-center bg-indigo-600 text-white py-1 rounded text-sm"
                    >
                      View
                    </Link>

                    {/* <button
                      className="flex-1 bg-red-500 text-white py-1 rounded text-sm"
                      onClick={() => {
                        api.delete(`/reports/${r._id}`).then(() => {
                          setReports((prev) =>
                            prev.filter((x) => x._id !== r._id)
                          );
                        });
                      }}
                    >
                      Delete
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
         <div className="flex justify-center mt-10">
  <Link
    to="/my"
    className="text-indigo-600 font-medium hover:underline text-sm"
  >
    View all reports →
  </Link>
</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔥 STAT COMPONENT */
function Stat({ title, value, color = "indigo" }) {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-100",
    green: "text-green-600 bg-green-100",
    yellow: "text-yellow-600 bg-yellow-100",
    gray: "text-gray-600 bg-gray-200",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <h2
        className={`text-xl font-bold mt-1 px-3 py-1 rounded ${colors[color]}`}
      >
        {value}
      </h2>
    </div>
  );
}
