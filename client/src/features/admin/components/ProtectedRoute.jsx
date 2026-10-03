import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ requiredRole = null, requiredPermission = null, children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FD8006] text-white font-black text-lg shadow-lg shadow-blue-600/30">
            AV
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
