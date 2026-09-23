import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
        <ShieldAlert size={36} strokeWidth={1.75} />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Access Restricted
      </h1>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
        You don&apos;t have permission to access this page. Please request access from the Super Administrator or return to your permitted dashboard workspace.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Go Back</span>
        </button>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 shadow-sm"
        >
          <Home size={15} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
