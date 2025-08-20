/*
import React, { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // --- Normalise response: many backends return { token, user } or { user, token } or nested ---
      // Try common shapes, adjust if your backend uses different fields.
      const token =
        res.data?.token ||
        res.data?.accessToken ||
        res.data?.data?.token ||
        res.data?.user?.token ||
        null;

      const user =
        res.data?.user ||
        res.data?.data?.user ||
        (res.data?.userId ? { id: res.data.userId, email } : null) ||
        null;

      // If backend sent only user object without a token (unlikely for JWT flow), still store user.
      // If backend sends a single object representing user (no token), we pass that as `user`.
      const finalUser = user ?? (res.data && typeof res.data === "object" ? res.data : null);

      // Save into auth context (login will set axios header and localStorage)
      login(token, finalUser);

      // Redirect to home
      nav("/");
    } catch (err) {
      // show backend message if present
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Welcome Back 👋
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
*/
// src/pages/SignIn.jsx
// src/pages/SignIn.jsx
// src/pages/SignIn.jsx
import React, { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleLogin from '../components/auth/GoogleLogin.jsx';
import PasswordInput from '../components/auth/PasswordInput.jsx';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      nav("/");
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        nav(`/otp-verify?email=${err.response.data.email}`);
      } else {
        setError(err?.response?.data?.message || err?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Welcome Back 👋
        </h1>
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg text-sm text-center">{error}</div>}
        
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <PasswordInput
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <GoogleLogin />

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}