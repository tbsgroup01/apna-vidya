import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Loader2 } from "lucide-react";

const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-lg shadow-lg shadow-blue-500/30">
            AV
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
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
