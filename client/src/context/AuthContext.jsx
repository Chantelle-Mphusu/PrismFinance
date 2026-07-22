import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextValue.jsx";

const apiBase =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Axios instance (COOKIE-BASED AUTH)
const api = axios.create({
  baseURL: apiBase,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOGIN
  // =========================
 const login = async (formData) => {
  try {
    const { data } = await api.post("/auth/login", formData);

    setUser(data.user);

    return data;

  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

  // =========================
  // SIGNUP
  // =========================
  const signup = async (formData) => {
  try {
    const { data } = await api.post("/auth/signup", formData);
    return data;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

  // =========================
  // SESSION RESTORE (/me)
  // =========================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get("/auth/me");

        setUser(data?.user || null);
      } catch (err) {
         console.error(" error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
  try {
    await api.post("/auth/logout");

    // CLEAR GLOBAL STATE
    setUser(null);

   
    window.location.href = "/login";

  } catch (err) {
    console.error("Logout error:", err);

    // still clear state even if backend fails
    setUser(null);
  }
};

// =========================
// VERIFY EMAIL
// =========================
const verifyEmail = async (token) => {
  try {
    const { data } = await api.get(`/auth/verify-email?token=${token}`);
    return data;
  } catch (err) {
    console.error("Verify email error:", err);
    throw err;
  }
};

// =========================
// FORGOT PASSWORD
// =========================
const forgotPassword = async (email) => {
  try {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  } catch (err) {
    console.error("Forgot password error:", err);
    throw err;
  }
};

// =========================
// RESET PASSWORD
// =========================
const resetPassword = async (token, newPassword) => {
  try {
    const { data } = await api.post("/auth/reset-password", { token, newPassword });
    return data;
  } catch (err) {
    console.error("Reset password error:", err);
    throw err;
  }
};

// =========================
// VERIFY 2FA
// =========================
const verify2FA = async (userId, code) => {
  try {
    const { data } = await api.post("/auth/verify-2fa", { userId, code });
    if (data.user) setUser(data.user);
    return data;
  } catch (err) {
    console.error("2FA verify error:", err);
    throw err;
  }
};
  // =========================
  // AUTH FETCH WRAPPER
  // =========================
  const authFetch = async (config) => {
    return api(config);
  };

  return (
  <AuthContext.Provider
    value={{
      user,
      loading,
      login,
      signup,
      logout,
      authFetch,
      verifyEmail,
      forgotPassword,
      resetPassword,
      verify2FA,
    }}
  >
    {children}
  </AuthContext.Provider>
);
};

export default AuthProvider;