// src/pages/OtpVerify.jsx
import React, { useState } from "react";
import { api } from "../api/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      login(res.data.token, res.data.user);
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }
  
  if (!email) {
    return (
        <div className="text-center p-8">
            <h1 className="text-red-500">Error: Email not found. Please start the process again.</h1>
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Verify Your Email
        </h1>
        <p className="text-center text-gray-600 mb-6">
          A 6-digit code was sent to <span className="font-semibold">{email}</span>.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Verification Code</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center tracking-[0.5em] text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="text"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}