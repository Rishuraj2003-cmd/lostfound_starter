// context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const parsedUser = userJson ? JSON.parse(userJson) : {};
        setUser({ ...parsedUser, token });
      } catch {
        setUser({ token });
      }
    }
    setLoadingAuth(false);
  }, []);

  function login(token, userObj) {
    if (!userObj) userObj = {};
    const finalUser = { ...userObj, token };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(finalUser));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(finalUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);

    // ✅ Redirect to signin after logout
    navigate("/signin");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
