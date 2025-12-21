import { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/authApi";
import { toast } from "sonner";

const AuthContext = createContext(null);

const normalizeRole = (role) => {
  const raw = (role || "").toString().toLowerCase();
  if (raw === "admin") return "ADMIN";
  if (raw === "donor" || raw === "donar") return "DONOR";
  if (raw === "hospital" || raw === "bloodbank" || raw === "organization") return "ORGANIZATION";
  return raw.toUpperCase();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.me();
      const normalizedUser = { ...userData, role: normalizeRole(userData.role || userData.legacyRole) };
      setUser(normalizedUser);
      // Update localStorage with the complete user data
      localStorage.setItem("liforceUser", JSON.stringify(normalizedUser));
    } catch (err) {
      console.error("Auth check failed:", err);
      // If 401, client.js might have tried refresh already. 
      // If it still fails, clear session.
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (payload) => {
    const normalized = { ...payload, role: normalizeRole(payload.role || payload.Role) };
    setUser(normalized);

    // Store critical data
    localStorage.setItem("liforceUser", JSON.stringify(normalized));
    if (payload.Token) localStorage.setItem("accessToken", payload.Token);
    if (payload.RefreshToken) localStorage.setItem("refreshToken", payload.RefreshToken);

    // Fetch full user profile for organization type and other details
    if (normalized.role === 'ORGANIZATION') {
      fetchUserProfile();
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userData = await authApi.me();
      const updatedUser = { ...userData, role: normalizeRole(userData.role || userData.legacyRole) };
      setUser(updatedUser);
      // Update localStorage with the complete user data including organizationType
      localStorage.setItem("liforceUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("liforceUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Optional: Redirect or notify
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      loading,
      isAuthenticated,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
