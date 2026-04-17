import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import ReportCard from "../components/ReportCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, FileQuestion } from "lucide-react";

export default function MyReports() {
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const { data, isLoading } = useQuery(
    ["myReports", filters],
    async () => (await api.get("/reports/my", { params: filters })).data
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 HEADER */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          My Reports
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage, edit and track your reports
        </p>
      </div>

      {/* 🔍 SEARCH */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              placeholder="Search your reports..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  q: e.target.value,
                }))
              }
            />
          </div>

          {/* MOBILE FILTER BTN */}
          <button
            onClick={() => setShowFilter(true)}
            className="lg:hidden bg-white border border-gray-200 px-3.5 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 transition"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* 🔥 DESKTOP FILTER BAR */}
      <div className="max-w-7xl mx-auto px-4 mt-4 hidden lg:block">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFilters(Object.fromEntries(new FormData(e.target)));
          }}
          className="hidden lg:grid grid-cols-5 gap-3"
        >
          <select name="type" className="border rounded-xl px-3 py-2">
            <option value="">All</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>

          <select name="status" className="border rounded-xl px-3 py-2">
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="CLAIMED">Claimed</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <input
            name="city"
            placeholder="City"
            className="border rounded-xl px-3 py-2"
          />

            <select name="date" className="border rounded-xl px-3 py-2">
            <option value="">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="older">Older</option>
          </select>

          <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition">
            Apply
          </button>
        </form>
      </div>

      {/* 📦 GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center text-gray-500 py-20">
            Loading your reports...
          </div>
        ) : data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {data.map((report, i) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ReportCard report={report} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
            <FileQuestion size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No reports found</h3>
            <p className="text-gray-500 mt-2">You haven't posted any items that match these filters.</p>
          </div>
        )}
      </div>

      {/* 🔥 MOBILE FILTER */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:hidden">
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-4 animate-slideUp">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-800">Filters</h3>
              <button onClick={() => setShowFilter(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* STATUS */}
            <select
              className="w-full border rounded-lg p-2"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="CLAIMED">Claimed</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            {/* TYPE */}
            <select
              className="w-full border rounded-lg p-2"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
            >
              <option value="">All Type</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>

            {/* CITY */}
            <input
              placeholder="City"
              className="w-full border rounded-lg p-2"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
            />

            {/* DATE */}
            <select
              className="w-full border rounded-lg p-2"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            >
              <option value="">Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="older">Older</option>
            </select>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilters({});
                  setShowFilter(false);
                }}
                className="flex-1 border rounded-lg py-2"
              >
                Reset
              </button>

              <button
                onClick={() => setShowFilter(false)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}