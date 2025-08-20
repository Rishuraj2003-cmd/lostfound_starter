// pages/ReportDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { io } from "socket.io-client";

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch report + comments initially
  useEffect(() => {
    api.get(`/reports/${id}`).then((r) => setReport(r.data));
    api.get(`/comments/${id}`).then((r) => setComments(r.data));
  }, [id]);

  // Setup socket connection
  useEffect(() => {
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5001"; // ✅ fixed to 5001

    const socket = io(baseUrl, {
      withCredentials: true,
    });

    socket.emit("joinReport", id);
    socket.on("comment:new", (c) => setComments((prev) => [...prev, c]));

    return () => socket.disconnect();
  }, [id]);

  // Add new comment
  async function addComment(e) {
    e.preventDefault();
    const body = e.target.body.value;
    if (!body) return;

    // Optimistic update: show immediately
    const temp = {
      _id: Date.now(),
      body,
      author: { name: "You" },
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, temp]);

    await api.post("/comments", { reportId: id, body });
    e.target.reset();
  }

  if (!report) return <div className="container-page py-8">Loading...</div>;

  return (
    <div className="container-page py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report */}
        <div className="lg:col-span-2 card p-4">
          <h1 className="text-2xl font-bold">{report.title}</h1>
          <div className="text-sm text-gray-500">
            {report.city} • {report.type}
          </div>

          {/* Images */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {report.images?.map((s, i) => {
              const apiBase =
                import.meta.env.VITE_API_URL?.replace("/api", "") ||
                "http://localhost:5001";
              const imageUrl = s.startsWith("http") ? s : `${apiBase}/${s}`;

              return (
                <img
                  key={i}
                  src={imageUrl}
                  alt="Report"
                  className="w-full h-40 object-cover rounded"
                />
              );
            })}
          </div>

          <p className="mt-4">{report.description}</p>
        </div>

        {/* Comments */}
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Comments</h2>
          <div className="space-y-3 max-h-80 overflow-auto">
            {comments.map((c) => (
              <div key={c._id} className="border rounded p-2 text-sm">
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="font-semibold">
                    {c.author?.name || "Anonymous"}
                  </span>
                  <span>{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <div>{c.body}</div>
              </div>
            ))}
          </div>
          <form onSubmit={addComment} className="mt-3 flex gap-2">
            <input
              name="body"
              className="input flex-1"
              placeholder="Add a comment/update"
            />
            <button className="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
