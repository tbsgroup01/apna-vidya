import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/auth/login");
      if (!isLoginRequest) {
        localStorage.removeItem("admin_token");
        if (
          (window.location.pathname.startsWith("/admin") ||
            window.location.pathname.startsWith("/student")) &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/admin/login"
        ) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
