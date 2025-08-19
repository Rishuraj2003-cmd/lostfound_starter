import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ q: "", type: "all", city: "" });

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get("/api/reports", { params: filters });
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-center text-white">
        <h1 className="text-4xl font-extrabold">Lost & Found</h1>
        <p className="mt-2 text-lg opacity-90">
          Helping people reconnect with their belongings
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto -mt-8 bg-white rounded-2xl shadow-lg p-6 flex flex-wrap gap-3 items-center justify-center">
        <input
          type="text"
          placeholder="Search by title or description..."
          className="flex-1 min-w-[200px] px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <select
          className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="all">All</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input
          type="text"
          placeholder="City"
          className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <button
          onClick={fetchReports}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Apply
        </button>
      </div>

      {/* Reports Grid */}
      <div className="max-w-6xl mx-auto mt-12 px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition group"
          >
            <div className="relative overflow-hidden rounded-t-2xl">
              <img
                src={r.images?.[0] || "/placeholder.jpg"}
                alt={r.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  r.type === "lost"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {r.type.toUpperCase()}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg line-clamp-1">{r.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{r.description}</p>
              <p className="text-gray-400 text-xs mt-1">{r.city}</p>
              <Link
                to={`/reports/${r._id}`}
                className="mt-3 inline-block text-indigo-600 font-medium hover:underline"
              >
                View details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
