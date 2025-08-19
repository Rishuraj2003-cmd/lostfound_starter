// pages/Reports.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/reports").then((r) => setReports(r.data));
  }, []);

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">
          Lost & Found Reports
        </h1>
        <Link
          to="/reports/new"
          className="btn bg-indigo-600 text-white rounded-lg px-4 py-2 shadow hover:bg-indigo-700"
        >
          ➕ New Report
        </Link>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length ? (
          reports.map((r) => (
            <Link key={r._id} to={`/reports/${r._id}`}>
              <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
                <img
                  src={r.images?.[0] || "https://via.placeholder.com/400x250"}
                  alt={r.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{r.title}</h2>
                  <p className="text-sm text-gray-500">
                    {r.city} • {r.type}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No reports available yet.</p>
        )}
      </div>
    </div>
  );
}
