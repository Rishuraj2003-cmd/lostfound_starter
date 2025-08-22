import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [reports, setReports] = useState([]);

 
  useEffect(() => {
    api.get("/users/dashboard")
      .then((res) => setReports(res.data.reports))
      .catch((err) => console.error("Error loading my reports", err));
  }, []);
  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>

      {reports.length === 0 ? (
        <p className="text-gray-500">You haven't posted any reports yet.</p>
      ) : (
        <div className="grid gap-4">
          {reports.map((r) => (
            <div key={r._id} className="card p-4">
              <h2 className="text-xl font-semibold">{r.title}</h2>
              <p className="text-sm text-gray-600">{r.city} • {r.type}</p>
              <p className="mt-2">{r.description}</p>
              <div className="mt-2 flex gap-2">
                {r.images?.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL?.replace("/api", "")}/${img}`}
                    alt="Report"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
