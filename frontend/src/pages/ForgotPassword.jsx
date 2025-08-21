import { useState } from "react";
import { api } from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "If the email exists, a reset link was sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container-page flex justify-center py-10">
      <div className="card p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email and we’ll send you a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="input w-full"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-primary w-full">Send Reset Link</button>
        </form>
        {message && <p className="mt-3 text-green-600">{message}</p>}
        {error && <p className="mt-3 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
