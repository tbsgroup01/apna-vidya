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
  CheckCircle,
  CheckCircle2,
  GraduationCap,
  Calendar,
  CreditCard,
  Layers,
  Sparkles,
  Newspaper,
  Edit,
  ShieldCheck,
  Mail,
  Tags,
  Code,
  DollarSign,
  FileText,
  Bell,
  Eye,
  Sliders,
  Image as ImageIcon,
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
  CheckCircle,
  CheckCircle2,
  GraduationCap,
  Calendar,
  CreditCard,
  Layers,
  Sparkles,
  Newspaper,
  Edit,
  ShieldCheck,
  Mail,
  Tags,
  Code,
  DollarSign,
  FileText,
  Bell,
  Eye,
  Sliders,
  Image: ImageIcon,
  TrendingUp,
  TrendingDown,
};

const colorVariants = {
  blue: {
    cardBg: "bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white",
    cardBorder: "border-blue-200/80 hover:border-blue-300 hover:shadow-blue-500/10",
    stripe: "from-blue-500 via-sky-500 to-indigo-600",
    glow: "bg-blue-400/15 group-hover:bg-blue-500/25",
    iconGradient: "from-blue-600 to-indigo-600",
    iconShadow: "shadow-blue-500/30",
    iconRing: "ring-blue-100",
    labelColor: "text-blue-800/80",
    watermarkColor: "text-blue-900",
  },
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white",
    cardBorder: "border-emerald-200/80 hover:border-emerald-300 hover:shadow-emerald-500/10",
    stripe: "from-emerald-500 via-teal-500 to-green-600",
    glow: "bg-emerald-400/15 group-hover:bg-emerald-500/25",
    iconGradient: "from-emerald-600 to-teal-600",
    iconShadow: "shadow-emerald-500/30",
    iconRing: "ring-emerald-100",
    labelColor: "text-emerald-800/80",
    watermarkColor: "text-emerald-900",
  },
  purple: {
    cardBg: "bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white",
    cardBorder: "border-purple-200/80 hover:border-purple-300 hover:shadow-purple-500/10",
    stripe: "from-purple-500 via-fuchsia-500 to-indigo-600",
    glow: "bg-purple-400/15 group-hover:bg-purple-500/25",
    iconGradient: "from-purple-600 to-fuchsia-600",
    iconShadow: "shadow-purple-500/30",
    iconRing: "ring-purple-100",
    labelColor: "text-purple-800/80",
    watermarkColor: "text-purple-900",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white",
    cardBorder: "border-amber-200/80 hover:border-amber-300 hover:shadow-amber-500/10",
    stripe: "from-amber-500 via-orange-500 to-yellow-600",
    glow: "bg-amber-400/15 group-hover:bg-amber-500/25",
    iconGradient: "from-amber-500 to-orange-600",
    iconShadow: "shadow-amber-500/30",
    iconRing: "ring-amber-100",
    labelColor: "text-amber-800/80",
    watermarkColor: "text-amber-900",
  },
  rose: {
    cardBg: "bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white",
    cardBorder: "border-rose-200/80 hover:border-rose-300 hover:shadow-rose-500/10",
    stripe: "from-rose-500 via-pink-500 to-red-600",
    glow: "bg-rose-400/15 group-hover:bg-rose-500/25",
    iconGradient: "from-rose-600 to-pink-600",
    iconShadow: "shadow-rose-500/30",
    iconRing: "ring-rose-100",
    labelColor: "text-rose-800/80",
    watermarkColor: "text-rose-900",
  },
  indigo: {
    cardBg: "bg-gradient-to-br from-indigo-50/90 via-blue-50/40 to-white",
    cardBorder: "border-indigo-200/80 hover:border-indigo-300 hover:shadow-indigo-500/10",
    stripe: "from-indigo-500 via-purple-500 to-blue-600",
    glow: "bg-indigo-400/15 group-hover:bg-indigo-500/25",
    iconGradient: "from-indigo-600 to-blue-600",
    iconShadow: "shadow-indigo-500/30",
    iconRing: "ring-indigo-100",
    labelColor: "text-indigo-800/80",
    watermarkColor: "text-indigo-900",
  },
  cyan: {
    cardBg: "bg-gradient-to-br from-cyan-50/90 via-sky-50/40 to-white",
    cardBorder: "border-cyan-200/80 hover:border-cyan-300 hover:shadow-cyan-500/10",
    stripe: "from-cyan-500 via-sky-500 to-blue-600",
    glow: "bg-cyan-400/15 group-hover:bg-cyan-500/25",
    iconGradient: "from-cyan-600 to-blue-600",
    iconShadow: "shadow-cyan-500/30",
    iconRing: "ring-cyan-100",
    labelColor: "text-cyan-800/80",
    watermarkColor: "text-cyan-900",
  },
  teal: {
    cardBg: "bg-gradient-to-br from-teal-50/90 via-emerald-50/40 to-white",
    cardBorder: "border-teal-200/80 hover:border-teal-300 hover:shadow-teal-500/10",
    stripe: "from-teal-500 via-emerald-500 to-cyan-600",
    glow: "bg-teal-400/15 group-hover:bg-teal-500/25",
    iconGradient: "from-teal-600 to-emerald-600",
    iconShadow: "shadow-teal-500/30",
    iconRing: "ring-teal-100",
    labelColor: "text-teal-800/80",
    watermarkColor: "text-teal-900",
  },
};

const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  comparison = "",
  trend,
  trendLabel = "",
  icon = "Users",
  color = "blue",
}) => {
  const IconComponent =
    typeof icon === "function" || (typeof icon === "object" && icon !== null)
      ? icon
      : (iconMap[icon] || Users);

  const theme = colorVariants[color] || colorVariants.blue;

  const displayChange =
    change !== undefined && change !== null && change !== ""
      ? change
      : trend !== undefined && trend !== null
        ? `${trend > 0 ? "+" : ""}${trend}%`
        : null;

  const displayLabel = comparison || trendLabel || null;

  const changePositive =
    isPositive !== undefined
      ? isPositive
      : trend !== undefined
        ? trend >= 0
        : true;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${theme.cardBorder} ${theme.cardBg} p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.stripe}`}
      />
      <div
        className={`absolute -right-6 -bottom-6 h-28 w-28 rounded-full ${theme.glow} blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-150`}
      />
      <div
        className={`absolute -right-2 -bottom-2 opacity-[0.06] pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.12] ${theme.watermarkColor}`}
      >
        <IconComponent size={90} strokeWidth={1.5} />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-bold uppercase tracking-wider ${theme.labelColor} truncate`}
          >
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </h3>
        </div>
        <div
          className={`flex h-12 w-12 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.iconGradient} text-white shadow-md ${theme.iconShadow} ring-4 ${theme.iconRing} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <IconComponent size={22} strokeWidth={2.2} />
        </div>
      </div>

      {(displayChange || displayLabel) ? (
        <div className="relative z-10 mt-4 flex items-center flex-wrap gap-2 pt-3 border-t border-slate-200/60 text-xs">
          {displayChange && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold ${changePositive
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200/60"
                : "bg-rose-100 text-rose-800 border border-rose-200/60"
                }`}
            >
              {changePositive ? (
                <TrendingUp size={12} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={12} strokeWidth={2.5} />
              )}
              <span>{displayChange}</span>
            </span>
          )}

        </div>
      ) : (
        <div className="relative z-10 mt-3.5 flex items-center">
          <span
            className={`h-1 w-8 rounded-full bg-gradient-to-r ${theme.stripe} opacity-70`}
          />
        </div>
      )}
    </div>
  );
};

export default StatCard;
