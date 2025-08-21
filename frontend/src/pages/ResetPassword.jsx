import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(res.data.message || "Password reset successfully");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container-page flex justify-center py-10">
      <div className="card p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="input w-full"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="input w-full"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button className="btn btn-primary w-full">Reset Password</button>
        </form>
        {success && <p className="mt-3 text-green-600">{success}</p>}
        {error && <p className="mt-3 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
