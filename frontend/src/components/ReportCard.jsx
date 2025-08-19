// components/ReportCard.jsx
import { Link } from "react-router-dom";

export default function ReportCard({ report }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition w-80 h-[420px] flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={report.images?.[0] || "/placeholder.jpg"}
          alt={report.title}
          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
            report.type === "LOST"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {report.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg line-clamp-1">{report.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{report.description}</p>
        <p className="text-gray-400 text-xs mt-1">{report.city}</p>

        {/* Glossy Button */}
        <Link
          to={`/reports/${report._id}`}
          className="mt-auto inline-block text-center px-4 py-2 rounded-lg 
                     bg-gradient-to-r from-indigo-500 to-indigo-700 
                     text-white font-medium shadow-md hover:shadow-lg 
                     transition transform hover:scale-105"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
