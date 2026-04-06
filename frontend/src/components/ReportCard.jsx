import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useState } from "react";

export default function ReportCard({ report }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isOwner =
    report.postedBy === user?.id || report.postedBy === user?._id;

  const [showEdit, setShowEdit] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [formData, setFormData] = useState({
    title: report.title,
    description: report.description,
    city: report.city,
  });

  // ✅ STATUS UPDATE
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      api.put(`/reports/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      queryClient.invalidateQueries(["myReports"]);
    },
  });

  // ✅ DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/reports/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      queryClient.invalidateQueries(["myReports"]);
    },
  });

  // ✅ UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data, images }) => {
      const form = new FormData();

      form.append("title", data.title);
      form.append("description", data.description);
      form.append("city", data.city);

      if (images?.length) {
        images.forEach((img) => form.append("images", img));
      }

      return api.put(`/reports/${id}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      queryClient.invalidateQueries(["myReports"]);
      setShowEdit(false);
      setPreview([]);
      setNewImages([]);
    },
  });

  // 🎯 STATUS STYLE
  const statusColor = {
    OPEN: "bg-green-500",
    CLAIMED: "bg-yellow-500",
    RESOLVED: "bg-gray-500",
  };

  const typeColor = {
    LOST: "bg-red-100 text-red-600",
    FOUND: "bg-green-100 text-green-600",
  };

  return (
    <>
      {/* 🔥 CARD */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">

        {/* IMAGE */}
        <div className="relative group">
          <img
            src={report.images?.[0] || "/placeholder.jpg"}
            alt={report.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
          />

          {/* TYPE */}
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${typeColor[report.type]}`}>
            {report.type}
          </span>

          {/* STATUS */}
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs text-white ${statusColor[report.status]}`}>
            {report.status}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-2 flex-1">

          {/* TITLE */}
          <h3 className="font-semibold text-base line-clamp-1">
            {report.title}
          </h3>

          {/* DESC */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {report.description}
          </p>

          {/* META */}
          <div className="text-xs text-gray-500 flex justify-between">
            <span>{report.city}</span>
            <span>
              {new Date(report.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>

          {/* OWNER CONTROLS */}
          {isOwner && (
            <div className="mt-2 space-y-2">

              <select
                value={report.status}
                onChange={(e) =>
                  statusMutation.mutate({
                    id: report._id,
                    status: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-400"
              >
                <option value="OPEN">Open</option>
                <option value="CLAIMED">Claimed</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEdit(true)}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1.5 rounded-lg transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteMutation.mutate(report._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* CTA */}
          <Link
            to={`/reports/${report._id}`}
            className="mt-auto text-center bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-2 rounded-lg text-sm font-medium hover:shadow-md transition"
          >
            View details →
          </Link>
        </div>
      </div>

      {/* 🔥 EDIT MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md space-y-4">

            <h3 className="font-semibold text-lg">Edit Report</h3>

            {/* OLD IMAGES */}
            <div className="flex gap-2 flex-wrap">
              {report.images?.map((img, i) => (
                <img key={i} src={img} className="w-16 h-16 rounded object-cover" />
              ))}
            </div>

            {/* INPUTS */}
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              placeholder="Title"
            />

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              placeholder="Description"
            />

            <input
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              placeholder="City"
            />

            {/* FILE */}
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setNewImages(files);
                setPreview(files.map((f) => URL.createObjectURL(f)));
              }}
              className="w-full"
            />

            {/* PREVIEW */}
            {preview.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {preview.map((img, i) => (
                  <img key={i} src={img} className="w-16 h-16 rounded border" />
                ))}
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: report._id,
                    data: formData,
                    images: newImages,
                  })
                }
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}