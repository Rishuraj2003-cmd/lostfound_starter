// 📁 pages/ReportDetail.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // ✅ FETCH DATA
  useEffect(() => {
    api.get(`/reports/${id}`).then((res) => setReport(res.data));
    api.get(`/comments/${id}`).then((res) => setComments(res.data));
  }, [id]);

  // ✅ ADD COMMENT
  const addComment = async () => {
    if (!text.trim()) return;

    const res = await api.post("/comments", {
      reportId: id,
      body: text,
    });

    setComments((prev) => [...prev, res.data]);
    setText("");
  };

  // ✅ START CHAT
 const handleChat = async () => {
  console.log("START");

  try {
    const userId = report.postedBy?._id || report.postedBy;

    console.log("USER ID:", userId);

    const res = await api.post("/chat/conversation", {
      userId,
      reportId: report._id,
    });

    console.log("RESPONSE:", res.data);

    navigate(`/chat/${res.data._id}`);
  } catch (err) {
    console.log("ERROR:", err);
  }
};

  if (!report) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">

      {/* 🔥 LEFT SIDE */}
      <div className="lg:col-span-2 space-y-4">

        {/* IMAGE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <img
            src={report.images?.[0] || "/placeholder.jpg"}
            alt={report.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm p-5">

          <h1 className="text-2xl font-bold">{report.title}</h1>

          <p className="text-sm text-gray-500 mt-1">
            {report.city} • {report.type}
          </p>

          {/* STATUS */}
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
              {report.type}
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-gray-200">
              {report.status}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-4 text-gray-700">{report.description}</p>

          {/* DATE */}
          <p className="text-xs text-gray-400 mt-4">
            {new Date(report.createdAt).toLocaleDateString("en-IN")}
          </p>

        </div>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div className="space-y-4">

        {/* OWNER CARD */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border">

          <p className="text-sm text-gray-500">Posted by</p>

          <p className="font-semibold text-lg">
            {report.postedBy?.name}
          </p>

          <button
            onClick={handleChat}
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            💬 Message Owner
          </button>

        </div>

        {/* COMMENTS */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border">

          <h3 className="font-semibold mb-3">Comments</h3>

          {/* COMMENT LIST */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {comments.map((c) => (
              <div key={c._id} className="bg-gray-100 p-2 rounded-lg text-sm">
                <p className="font-medium text-gray-700">
                  {c.author?.name || "User"}
                </p>
                <p className="text-gray-600">{c.body}</p>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="flex gap-2 mt-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={addComment}
              className="bg-indigo-600 text-white px-4 rounded-lg"
            >
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}