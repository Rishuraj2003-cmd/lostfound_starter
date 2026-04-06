import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import ReportCard from "../components/ReportCard";

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
      <div className="bg-white border-b sticky top-16 z-40">

        <div className="max-w-7xl mx-auto px-4 py-4">

          {/* SEARCH */}
          <div className="flex gap-3 mb-3">
            <input
              placeholder="Search lost or found items..."
              className="flex-1 border rounded-xl px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  q: e.target.value,
                }))
              }
            />

            {/* MOBILE FILTER BTN */}
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden border px-3 rounded-xl"
            >
              ⚙️
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
      <div className="text-center py-24 bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <h1 className="text-4xl md:text-5xl font-bold">
          Lost Something? Found Something?
        </h1>
        <p className="mt-4 text-sm md:text-lg text-indigo-100">
          Connect with your community to reunite lost items with their owners
        </p>
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

            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilter(false)}>✖</button>
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