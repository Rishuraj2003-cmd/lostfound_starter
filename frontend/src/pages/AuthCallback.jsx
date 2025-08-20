// frontend/src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userString = params.get("user");

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        login(token, user); // save in context
        navigate("/", { replace: true }); // ✅ redirect home
      } catch (err) {
        console.error("Failed to parse Google user", err);
        navigate("/signin", { replace: true });
      }
    } else {
      navigate("/signin", { replace: true });
    }
  }, [location, login, navigate]);

  return <p>Signing you in with Google...</p>;
}
