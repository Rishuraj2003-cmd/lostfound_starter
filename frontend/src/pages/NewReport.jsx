import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { UploadCloud, MapPin, Tag } from "lucide-react";

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
      alert(err.response?.data?.error || err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4 md:p-8">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

        {/* LEFT SIDE: IMAGE (Hidden on mobile) */}
        <div className="hidden md:block md:w-1/2 relative bg-indigo-600">
          <img 
            src="/findit-illustration.png" 
            alt="Lost and Found" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/20 to-transparent flex flex-col justify-end p-10 text-white">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h2 className="text-3xl font-bold mb-2 text-white shadow-sm">Reunite what matters.</h2>
              <p className="text-indigo-50 font-medium leading-relaxed">
                Provide as many details as possible to help the community instantly recognize and return the item.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12 overflow-y-auto custom-scrollbar">

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

            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-indigo-400 transition-colors flex flex-col items-center justify-center">
              <UploadCloud className="text-indigo-400 mb-3" size={32} />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const selected = Array.from(e.target.files);
                  let valid = selected.filter(file => file.size < 2 * 1024 * 1024);

                  if (valid.length !== selected.length) {
                    alert("Some images were excluded because they are too large (max 2MB)");
                  }

                  if (valid.length > 4) {
                    alert("You can only upload a maximum of 4 images.");
                    valid = valid.slice(0, 4);
                  }

                  setFiles(valid);
                }}
                className="hidden"
                id="upload"
              />
              <label htmlFor="upload" className="cursor-pointer text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Click to upload images
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, up to 2MB</p>
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
    </div>
  );
}
