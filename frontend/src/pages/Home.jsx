// pages/Home.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import ReportCard from "../components/ReportCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useQuery(
    ["reports", filters],
    async () => (await api.get("/reports", { params: filters })).data
  );

  return (
    <div className="min-h-screen bg-blue-200 py-8">
      <div className="container-page space-y-8">
        {/* 🔍 Search & Filters */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setFilters(Object.fromEntries(new FormData(e.target)));
            }}
          >
            <input
              name="q"
              className="input border rounded-lg px-3 py-2"
              placeholder="Search by title or description..."
            />
            <select name="type" className="input border rounded-lg px-3 py-2">
              <option value="">All</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>
            <input
              name="city"
              className="input border rounded-lg px-3 py-2"
              placeholder="City"
            />
            <button className="btn bg-blue-300 text-gray-950 rounded-lg py-2 hover:text-indigo-700 transition">
              Apply
            </button>
          </form>
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {data?.items?.length ? (
                data.items.map((r, i) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ReportCard report={r} />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-full">
                  No reports found.
                </p>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}