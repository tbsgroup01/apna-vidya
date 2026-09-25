import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("admin_token");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      localStorage.removeItem("admin_token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        const { user: loggedInUser, token: authToken } = response.data.data;
        localStorage.setItem("admin_token", authToken);
        setToken(authToken);
        setUser(loggedInUser);
        setIsAuthenticated(true);
        return { success: true, user: loggedInUser };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to sign in. Please try again.";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      localStorage.removeItem("admin_token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch {
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      if (response.data.success) {
        setUser(response.data.data.user);
        return {
          success: true,
          user: response.data.data.user,
          message: response.data.message || "Profile updated successfully.",
        };
      }
      return {
        success: false,
        message: response.data.message || "Failed to update profile.",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile.",
      };
    }
  };

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return {
        success: response.data.success,
        message: response.data.message || "Password updated successfully.",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to change password.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
