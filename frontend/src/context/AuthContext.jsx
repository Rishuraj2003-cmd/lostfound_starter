import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client"; // assumes your client exports `api` as named export

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // restore auth from localStorage on app start
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    if (token) {
      // set axios default header so all requests include token
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

  // login expects (token, userObj). If backend returns different shape, adjust SignIn to pass them.
  /*
  function login(token, userObj) {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    if (userObj) {
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    } else if (token && !userObj) {
      setUser({ token });
    }
  }
    */
  function login(token, userObj) {
    if (!userObj) userObj = {};
    
    // Merge token into user object
    const finalUser = { ...userObj, token };
  
    // Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(finalUser));
  
    // Set axios default header
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
    // Update context
    setUser(finalUser);
  }
  

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
