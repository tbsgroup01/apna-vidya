import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Target,
  Clock,
  IndianRupee,
  AlertCircle,
  PlayCircle,
  Award,
} from "lucide-react";

const iconMap = {
  Users,
  BookOpen,
  Target,
  Clock,
  IndianRupee,
  AlertCircle,
  PlayCircle,
  Award,
};

const colorVariants = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  cyan: {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-100",
  },
};

const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  comparison = "vs last month",
  icon = "Users",
  color = "blue",
}) => {
  const IconComponent = iconMap[icon] || Users;
  const theme = colorVariants[color] || colorVariants.blue;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </h3>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${theme.border} ${theme.bg} ${theme.text} transition-transform group-hover:scale-105`}
        >
          <IconComponent size={22} strokeWidth={2.2} />
        </div>
      </div>

      {/* <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
        >
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-500 font-medium">{comparison}</span>
      </div> */}


    </div>
  );
};

export default StatCard;
