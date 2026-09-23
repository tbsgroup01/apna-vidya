import React from "react";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
  sent: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20",
  
  new: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20",
  upcoming: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20",

  interested: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-600/20",
  "follow-up": "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20",
  partial: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20",
  pending: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20",
  requested: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20",
  contacted: "bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-600/20",
  draft: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/20",
  inactive: "bg-slate-100 text-slate-600 border-slate-200 ring-slate-600/20",
  disabled: "bg-slate-100 text-slate-600 border-slate-200 ring-slate-600/20",

  failed: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20",
  overdue: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20",
  revoked: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20",
  "not interested": "bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20",
  refunded: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20",
};

const StatusBadge = ({ status, size = "md" }) => {
  if (!status) return null;
  const key = String(status).toLowerCase().trim();
  const classes = statusStyles[key] || "bg-slate-100 text-slate-700 border-slate-200";

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold capitalize tracking-wide transition-colors ${sizeClasses} ${classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
