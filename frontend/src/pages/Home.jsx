import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import ReportCard from "../components/ReportCard";
import { Search, Filter, X } from "lucide-react";

export default function Home() {
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const { data, isLoading } = useQuery(
    ["reports", filters],
    async () =>
      (await api.get("/reports", { params: filters })).data
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔍 SEARCH + FILTER */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">

          {/* SEARCH */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                placeholder="Search lost or found items..."
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
              className="lg:hidden border border-gray-200 bg-white px-3.5 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 transition"
            >
              <Filter size={20} />
            </button>
          </div>

          {/* DESKTOP FILTER */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFilters(Object.fromEntries(new FormData(e.target)));
            }}
            className="hidden lg:grid grid-cols-5 gap-3"
          >
            <select name="type" className="border rounded-xl px-3 py-2">
              <option value="">All Type</option>
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

            <button className="bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
              Apply
            </button>
          </form>

        </div>
      </div>

      {/* 🎯 HERO */}
      <div className="text-center py-20 lg:py-28 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-inner relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute top-1/2 right-10 w-72 h-72 rounded-full bg-blue-300 blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Lost Something? <span className="text-indigo-200">Found Something?</span>
          </h1>
          <p className="mt-6 text-base md:text-xl text-indigo-100 max-w-2xl mx-auto font-medium">
            Connect with your community to reunite lost items with their owners quickly and safely.
          </p>
        </div>
      </div>

      {/* 📦 GRID */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data?.items?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.map((r) => (
              <ReportCard key={r._id} report={r} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No items found 😔</p>
        )}
      </div>

      {/* 📱 MOBILE FILTER MODAL */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:hidden">
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-4 animate-slideUp">

            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-xl text-gray-800">Filters</h3>
              <button onClick={() => setShowFilter(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <select
              className="w-full border p-2 rounded"
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

            <select
              className="w-full border p-2 rounded"
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

            <input
              placeholder="City"
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
            />

            <select
              className="w-full border p-2 rounded"
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

            <button
              onClick={() => setShowFilter(false)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}