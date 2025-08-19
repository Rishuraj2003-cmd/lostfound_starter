// src/pages/NewReport.jsx


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function NewReport() {
  // const { user } = useAuth(); // get logged-in user & token
  const auth = useAuth(); // keep the whole context, not just user

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
      alert("You must be logged in to post a report.");
      return;
    }
  
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("images", f));
  
    try {
      await api.post("/reports", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      alert("Report posted successfully!");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }
  
  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-xl font-bold mb-4 text-blue-600">Post a Lost/Found Report</h1>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              className="input"
              value={form.type}
              onChange={(e) => onChange("type", e.target.value)}
            >
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>
            <input
              className="input"
              placeholder="Category"
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
            />
          </div>

          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
          />
          <textarea
            className="input h-28"
            placeholder="Description"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="City"
              value={form.city}
              onChange={(e) => onChange("city", e.target.value)}
            />
            <input
              className="input"
              placeholder="Address"
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
            />
            <input
              className="input"
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => onChange("lat", e.target.value)}
            />
            <input
              className="input"
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => onChange("lng", e.target.value)}
            />
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          <button className="btn btn-primary" type="submit">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
