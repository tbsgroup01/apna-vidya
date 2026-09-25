import React from "react";
import { Link } from "react-router-dom";
import { FileQuestion, Home } from "lucide-react";

const AdminNotFound = () => {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-[13px]late-500 border border-slate-200">
        <FileQuestion size={36} strokeWidth={1.75} />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-[13px]late-900 sm:text-3xl">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-xs sm:text-[13px]m text-[13px]late-500 leading-relaxed">
        The administrative route you are searching for does not exist or has been relocated to another module.
      </p>
      <div className="mt-6">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 shadow-sm"
        >
          <Home size={15} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminNotFound;
