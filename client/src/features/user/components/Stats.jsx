import React from "react";
import { Users, GraduationCap, Building2, Star, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Students",
    subtext: "Learning across 28 states",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Success Rate",
    subtext: "In board exams & placements",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Building2,
    value: "120+",
    label: "Hiring Partners",
    subtext: "Top startups & MNCs",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Star,
    value: "4.9 / 5",
    label: "Average Rating",
    subtext: "From 12,000+ student reviews",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

const Stats = () => {
  return (
    <section className="relative -mt-6 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:p-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl p-4 transition-all hover:bg-slate-50"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}
                >
                  <Icon size={26} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-500">{stat.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
