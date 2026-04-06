import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function NewReport() {
  const auth = useAuth();

  const [form, setForm] = useState({
    type: "LOST",
    title: "",
    description: "",
    category: "",
    city: "",
    address: "",
    lat: "",
    lng: "",
  });

  const [files, setFiles] = useState([]);
  const nav = useNavigate();

  function onChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();

    const currentUser = auth.user;
    if (!currentUser?.token) {
      alert("Login required");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("images", f));

    try {
      await api.post("/reports", fd, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      alert("Report posted!");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Post a Report
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Share lost or found item details
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">

          {/* TYPE */}
          <div>
            <p className="text-sm font-medium text-gray-700">Type</p>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => onChange("type", "LOST")}
                className={`px-4 py-2 rounded-lg border text-sm transition 
                  ${form.type === "LOST"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 hover:bg-gray-100"}`}
              >
                Lost
              </button>

              <button
                type="button"
                onClick={() => onChange("type", "FOUND")}
                className={`px-4 py-2 rounded-lg border text-sm transition 
                  ${form.type === "FOUND"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-300 hover:bg-gray-100"}`}
              >
                Found
              </button>
            </div>
          </div>

          {/* TITLE */}
          <div>
            <p className="text-sm font-medium text-gray-700">Title</p>
            <input
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="text-sm font-medium text-gray-700">Description</p>
            <textarea
              value={form.description}
              onChange={(e) => onChange("description", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-28"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <p className="text-sm font-medium text-gray-700">Category</p>
            <input
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>

          {/* LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">City</p>
              <input
                value={form.city}
                onChange={(e) => onChange("city", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Address</p>
              <input
                value={form.address}
                onChange={(e) => onChange("address", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* LAT LNG */}
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => onChange("lat", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <input
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => onChange("lng", e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>

          {/* FILE UPLOAD */}
          <div>
            <p className="text-sm font-medium text-gray-700">Images</p>

            <div className="mt-2 border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="hidden"
                id="upload"
              />
              <label htmlFor="upload" className="cursor-pointer text-sm text-gray-500">
                Click to upload images
              </label>
            </div>

            {/* PREVIEW */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {files.map((f, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(f)}
                  className="w-14 h-14 rounded-md object-cover border"
                />
              ))}
            </div>
          </div>

          {/* BUTTON */}
          <button
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Upload Report
          </button>

        </form>
      </div>
    </div>
  );
}
