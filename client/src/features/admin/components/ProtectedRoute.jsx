import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useSettings, sanitizeAssetUrl } from "../../../context/SettingsContext";
import defaultLogo from "../../../assets/apnavidya.png";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ requiredRole = null, requiredPermission = null, children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { settings } = useSettings();
  const logoSrc = sanitizeAssetUrl(settings.general?.logoUrl, defaultLogo);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center rounded-2xl bg-white/95 px-4 py-2 shadow-xl shadow-black/30 backdrop-blur-sm">
            <img
              src={logoSrc}
              alt="Logo"
              onError={(e) => {
                if (e.currentTarget.src !== defaultLogo) {
                  e.currentTarget.src = defaultLogo;
                }
              }}
              className="h-12 w-auto max-w-[180px] object-contain animate-pulse"
            />
          </div>
          <div className="flex items-center gap-2.5 text-[13px]late-400 text-xs font-semibold">
            <Loader2 size={16} className="animate-spin text-blue-500" />
            <span>Verifying administrator credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role === "Student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (requiredRole && user?.role !== "Super Admin" && user?.role !== requiredRole) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  if (
    requiredPermission &&
    user?.role !== "Super Admin" &&
    (!user?.permissions || !user.permissions.includes(requiredPermission))
  ) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
