import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useSettings, sanitizeAssetUrl } from "../../../context/SettingsContext";
import defaultLogo from "../../../assets/apnavidya.png";
import { Loader2 } from "lucide-react";

const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { settings } = useSettings();
  const logoSrc = sanitizeAssetUrl(settings.general?.logoUrl, defaultLogo);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <img
            src={logoSrc}
            alt="Logo"
            onError={(e) => {
              if (e.currentTarget.src !== defaultLogo) {
                e.currentTarget.src = defaultLogo;
              }
            }}
            className="h-12 w-auto max-w-[180px] object-contain drop-shadow-sm animate-pulse"
          />
          <div className="flex items-center gap-2.5 text-[13px]late-500 text-xs font-semibold">
            <Loader2 size={16} className="animate-spin text-blue-600" />
            <span>Loading student learning portal...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "Student" && user?.role !== "Super Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default StudentProtectedRoute;
