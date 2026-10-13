import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  BookPlus,
  FilePlus2,
  Award,
  BellRing,
  ArrowRight,
  Eye,
  Users,
  BookOpen,
  Calendar,
  IndianRupee,
  Sparkles,
  Target,
  GraduationCap,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  DemandingProgramsBarChart,
  CoursePopularityBars,
  LeadConversionDonut,
  LeadDetailsDonutChart,
} from "../components/ChartComponents";
import api from "../../../services/api";

const leadAvatarColors = [
  "from-blue-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
];

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      id: "stat-1",
      title: "Total Registered Learners",
      value: "0",
      trend: 0,
      trendLabel: "Live database records",
      icon: Users,
      color: "blue",
    },
    {
      id: "stat-2",
      title: "Active Course Programs",
      value: "0",
      trend: 0,
      trendLabel: "Published on portal",
      icon: BookOpen,
      color: "indigo",
    },
    {
      id: "stat-3",
      title: "Live Classroom Batches",
      value: "0",
      trend: 0,
      trendLabel: "Conducted by mentors",
      icon: Calendar,
      color: "purple",
    },
    {
      id: "stat-4",
      title: "Gross Fee Collection",
      value: "₹0",
      trend: 0,
      trendLabel: "Reconciled tuition",
      icon: IndianRupee,
      color: "emerald",
    },
  ]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [mostDemandingPrograms, setMostDemandingPrograms] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [leadConversionData, setLeadConversionData] = useState([]);
  const [leadBreakdownData, setLeadBreakdownData] = useState([]);
  const [rawLeadsList, setRawLeadsList] = useState([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [conversionRateVal, setConversionRateVal] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.allSettled([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/leads?limit=500"),
        ]);

        let liveDemanding = [];

        // 1. Process leads directly from /admin/leads to guarantee 100% sync with /admin/demo-classes
        if (leadsRes.status === "fulfilled" && leadsRes.value.data?.data?.leads) {
          const allFetchedLeads = leadsRes.value.data.data.leads || [];
          setRawLeadsList(allFetchedLeads);
          const demoLeads = allFetchedLeads.filter(
            (l) =>
              (l.source && l.source.toLowerCase().includes("demo")) ||
              (l.message && l.message.toLowerCase().includes("demo")) ||
              (l.notes && Array.isArray(l.notes) && l.notes.some((n) => (n.text || "").toLowerCase().includes("demo")))
          );

          const counts = {};
          demoLeads.forEach((l) => {
            const cName = (l.course && l.course.trim()) ? l.course.trim() : "General Program";
            counts[cName] = (counts[cName] || 0) + 1;
          });

          liveDemanding = Object.entries(counts)
            .map(([course, count]) => ({
              course,
              count,
              unit: count === 1 ? "demo request" : "demo requests",
            }))
            .sort((a, b) => b.count - a.count);
        }

        // 2. Process /admin/dashboard/stats for overall dashboard metrics
        if (statsRes.status === "fulfilled" && statsRes.value.data?.data) {
          const {
            stats: liveStats,
            recentLeads: liveLeads,
            recentStudents: liveStudents,
            mostDemandingPrograms: backendDemanding,
            coursePopularity: livePop,
            leadConversion,
          } = statsRes.value.data.data;

          if (liveStats) {
            setStats([
              {
                id: "stat-1",
                title: "Total Registered Learners",
                value: (liveStats.totalStudents || 0).toLocaleString(),
                trend: liveStats.totalStudents > 0 ? 12 : 0,
                trendLabel: "Live database records",
                icon: Users,
                color: "blue",
              },
              {
                id: "stat-2",
                title: "Active Course Programs",
                value: (liveStats.activeCourses || 0).toLocaleString(),
                trend: liveStats.activeCourses > 0 ? 8 : 0,
                trendLabel: "Published on portal",
                icon: BookOpen,
                color: "indigo",
              },
              {
                id: "stat-3",
                title: "Live Classroom Batches",
                value: (liveStats.activeBatches || 0).toLocaleString(),
                trend: liveStats.activeBatches > 0 ? 15 : 0,
                trendLabel: "Conducted by mentors",
                icon: Calendar,
                color: "purple",
              },
              {
                id: "stat-4",
                title: "Gross Fee Collection",
                value: `₹${Math.round(liveStats.totalRevenue || 0).toLocaleString()}`,
                trend: liveStats.totalRevenue > 0 ? 18 : 0,
                trendLabel: "Reconciled tuition",
                icon: IndianRupee,
                color: "emerald",
              },
            ]);
          }

          setRecentLeads(liveLeads || []);

          if (liveStudents) {
            setRecentStudents(
              liveStudents.map((s) => ({
                id: s.id,
                name: s.name,
                course: s.enrolledCourses?.[0]?.name || "N/A",
                paidFees: s.paidFees || 0,
                paymentStatus: s.paymentStatus || "Active",
                avatar:
                  s.profileImage ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              }))
            );

            const paidStudents = liveStudents.filter((s) => Number(s.paidFees || 0) > 0);
            setRecentPayments(
              paidStudents.map((s) => ({
                id: `PAY-${String(s.id).padStart(4, "0")}`,
                studentName: s.name,
                course: s.enrolledCourses?.[0]?.name || "Course Program",
                amount: Number(s.paidFees || 0),
                method: "Online / UPI",
                date: s.admissionDate || new Date().toISOString().split("T")[0],
                status: s.paymentStatus === "Paid" ? "Success" : "Partial",
              }))
            );
          } else {
            setRecentStudents([]);
            setRecentPayments([]);
          }

          if (leadConversion && Array.isArray(leadConversion)) {
            setLeadConversionData(leadConversion);
          } else {
            setLeadConversionData([]);
          }

          // If liveDemanding from direct leads was empty, fall back to backendDemanding or livePop
          if (liveDemanding.length === 0) {
            const fallbackDemanding = backendDemanding || livePop || [];
            if (fallbackDemanding && fallbackDemanding.length > 0) {
              liveDemanding = fallbackDemanding
                .filter((c) => (c.count ?? c.enrolled ?? 0) > 0)
                .map((c) => ({
                  course: c.course || c.name || "General Program",
                  count: c.count ?? c.enrolled ?? 0,
                  unit: (c.count ?? c.enrolled ?? 0) === 1 ? "demo request" : "demo requests",
                }));
            }
          }
        }

        // 3. Compute comprehensive lead details for Donut Chart
        let calculatedBreakdown = [];
        let totalCount = 0;
        let convRate = 0;

        if (statsRes.status === "fulfilled" && statsRes.value.data?.data) {
          const d = statsRes.value.data.data;
          totalCount = d.stats?.totalLeads || 0;
          convRate = d.stats?.conversionRate || 0;
          if (Array.isArray(d.leadConversion) && d.leadConversion.length > 0) {
            calculatedBreakdown = d.leadConversion.map((item) => ({
              label: item.label,
              count: item.value,
              color: item.color,
            }));
          }
        }

        if (leadsRes.status === "fulfilled" && leadsRes.value.data?.data?.leads) {
          const allFetchedLeads = leadsRes.value.data.data.leads;
          if (allFetchedLeads.length > 0) {
            totalCount = allFetchedLeads.length;

            const statusMeta = {
              Converted: { label: "Converted", color: "#10b981" },
              New: { label: "New Leads", color: "#3b82f6" },
              Contacted: { label: "Follow-up", color: "#f59e0b" },
              "In Progress": { label: "In Progress", color: "#f59e0b" },
              "Follow-up": { label: "Follow-up", color: "#f59e0b" },
              Interested: { label: "Interested", color: "#8b5cf6" },
              "Demo Scheduled": { label: "Demo Scheduled", color: "#ec4899" },
              "Not Interested": { label: "Lost", color: "#f43f5e" },
              Lost: { label: "Lost", color: "#f43f5e" },
              Closed: { label: "Closed", color: "#94a3b8" },
            };

            const counts = {};
            allFetchedLeads.forEach((l) => {
              const st = (l.status && l.status.trim()) || "New";
              counts[st] = (counts[st] || 0) + 1;
            });

            const convertedCount = counts["Converted"] || 0;
            convRate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;

            calculatedBreakdown = Object.entries(counts)
              .map(([rawStatus, count]) => {
                const meta = statusMeta[rawStatus] || { label: rawStatus, color: "#6366f1" };
                return {
                  label: meta.label,
                  count,
                  color: meta.color,
                };
              })
              .sort((a, b) => b.count - a.count);
          }
        }

        setLeadBreakdownData(calculatedBreakdown);
        setTotalLeadsCount(totalCount);
        setConversionRateVal(convRate);

        setMostDemandingPrograms(liveDemanding);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 4000); // 4-second real-time poll
    const handleUpdate = () => fetchDashboardStats();

    window.addEventListener("focus", handleUpdate);
    window.addEventListener("leads-updated", handleUpdate);
    window.addEventListener("demo-classes-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("leads-updated", handleUpdate);
      window.removeEventListener("demo-classes-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const quickActions = [
    {
      label: "Add Student",
      desc: "Enroll learner",
      path: "/admin/students/create",
      icon: UserPlus,
      bg: "bg-blue-50/80",
      border: "border-blue-200/90 hover:border-blue-300",
      iconBg: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20",
      textColor: "text-slate-900",
      subColor: "text-blue-700",
      hoverShadow: "hover:shadow-md",
    },
    {
      label: "Add Course",
      desc: "Curriculum tracks",
      path: "/admin/courses/create",
      icon: BookPlus,
      bg: "bg-indigo-50/80",
      border: "border-indigo-200/90 hover:border-indigo-300",
      iconBg: "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-500/20",
      textColor: "text-slate-900",
      subColor: "text-indigo-700",
      hoverShadow: "hover:shadow-md",
    },
    {
      label: "Add Blog",
      desc: "Publish articles",
      path: "/admin/blogs/create",
      icon: FilePlus2,
      bg: "bg-emerald-50/80",
      border: "border-emerald-200/90 hover:border-emerald-300",
      iconBg: "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-500/20",
      textColor: "text-slate-900",
      subColor: "text-emerald-700",
      hoverShadow: "hover:shadow-md",
    },
    {
      label: "Certificates",
      desc: "Awards & honors",
      path: "/admin/certificates",
      icon: Award,
      bg: "bg-purple-50/80",
      border: "border-purple-200/90 hover:border-purple-300",
      iconBg: "bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white shadow-purple-500/20",
      textColor: "text-slate-900",
      subColor: "text-purple-700",
      hoverShadow: "hover:shadow-md",
    },
    {
      label: "Broadcast",
      desc: "Post notice",
      path: "/admin/notifications",
      icon: BellRing,
      bg: "bg-cyan-50/80",
      border: "border-cyan-200/90 hover:border-cyan-300",
      iconBg: "bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-cyan-500/20",
      textColor: "text-slate-900",
      subColor: "text-cyan-700",
      hoverShadow: "hover:shadow-md",
    },
  ];

  const leadAvatarColors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-fuchsia-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
  ];

  return (
    <div className="space-y-7">
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 p-6 sm:p-7 shadow-xs">
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 h-36 w-36 rounded-full bg-indigo-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50/90 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs mb-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Live System Sync Active</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Live Administrative Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Real-time student admissions, fees reconciliation, courses health, and institutional workflows for APNAVIDYA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/students/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 hover:from-purple-700 hover:to-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <UserPlus size={15} />
              <span>New Admission</span>
            </Link>
            <Link
              to="/admin/leads"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <span>View Inquiries</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Sparkles size={14} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Quick Management Actions
            </p>
          </div>
          <span className="text-[13px] font-semibold text-slate-400">Instant shortcuts</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className={`relative overflow-hidden flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${action.border} ${action.bg} ${action.hoverShadow}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${action.iconBg}`}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-black truncate ${action.textColor}`}>
                    {action.label}
                  </p>
                  <p className={`text-[12px] font-semibold truncate ${action.subColor}`}>
                    {action.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>


      {/* Row: Most Demanding Programs (70%) & Leads Details Donut Chart (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 items-stretch w-full">
        {/* 70% Column: Most Demanding Programs Bar Chart */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/40 via-white to-fuchsia-50/20 p-5 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xs">
                <BookOpen size={18} strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Most Demanding Programs
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/90 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time ranking based on live demo class requests
                </p>
              </div>
            </div>
            <Link
              to="/admin/demo-classes"
              className="inline-flex items-center gap-1 rounded-xl bg-purple-100/90 border border-purple-200/60 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-600 hover:text-white transition-all shadow-2xs"
            >
              <span>View Demo Classes</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {mostDemandingPrograms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center my-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 mb-3">
                  <BookOpen size={24} />
                </div>
                <p className="text-sm font-bold text-slate-800">No demo class requests recorded yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Real-time course demand rankings will appear here automatically when visitors book demo classes.
                </p>
                <Link
                  to="/admin/demo-classes"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  <span>Check Demo Classes</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <DemandingProgramsBarChart data={mostDemandingPrograms} />
            )}
          </div>
        </div>

        {/* 30% Column: Leads Details Donut Chart */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/20 p-4 sm:p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between min-w-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs">
                <Target size={18} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    Leads Overview
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/90 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Real-time data from /admin/leads
                </p>
              </div>
            </div>
            <Link
              to="/admin/leads"
              className="inline-flex items-center gap-1 rounded-xl bg-blue-100/90 border border-blue-200/60 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs shrink-0 ml-1"
            >
              <span>View Leads</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center min-w-0 overflow-hidden w-full">
            <LeadDetailsDonutChart
              data={leadBreakdownData}
              leads={rawLeadsList}
              totalCount={totalLeadsCount}
              conversionRate={conversionRateVal}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-white shadow-xs">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Inquiries</h3>
                <p className="text-xs text-slate-500">Latest website & demo inquiries</p>
              </div>
            </div>
            <Link
              to="/admin/demo-classes"
              className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200/60 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-[#FD8006] hover:text-white transition-all"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-blue-50/30 border-b border-blue-100/70 text-[13px] font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <p className="text-sm font-bold text-slate-800">No inquiries recorded yet</p>
                      <p className="text-xs text-slate-400 mt-1">Live inquiries submitted through the website will appear here.</p>
                      <Link
                        to="/admin/leads"
                        className="mt-3 inline-block rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Open Leads Management
                      </Link>
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-bold text-slate-900">{lead.name}</p>
                          <p className="text-[13px] text-slate-400 font-mono">{lead.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {lead.course}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[13px] font-medium text-slate-600 border border-slate-200/60">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-200/80 bg-blue-50/60 px-2.5 py-1 text-[13px] font-bold text-blue-700 hover:bg-[#FD8006] hover:text-white hover:border-blue-600 transition-all"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-purple-200/80 bg-white shadow-xs">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <GraduationCap size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Students</h3>
                <p className="text-xs text-slate-500">Newly enrolled students</p>
              </div>
            </div>
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-200/60 px-2.5 py-1 text-xs font-bold text-purple-700 hover:bg-purple-600 hover:text-white transition-all"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gradient-to-r from-purple-50/70 via-slate-50 to-purple-50/30 border-b border-purple-100/70 text-[13px] font-bold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Fees Paid</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <p className="text-sm font-bold text-slate-800">No enrolled students yet</p>
                      <p className="text-xs text-slate-400 mt-1">Enrolled learner profiles will appear here.</p>
                      <Link
                        to="/admin/students/create"
                        className="mt-3 inline-block rounded-xl bg-purple-50 border border-purple-200 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
                      >
                        + Enroll New Student
                      </Link>
                    </td>
                  </tr>
                ) : (
                  recentStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              stu.avatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                            }
                            alt={stu.name}
                            className="h-8 w-8 rounded-xl object-cover object-top ring-2 ring-purple-200"
                            style={{ objectPosition: "top" }}
                          />
                          <div>
                            <p className="font-bold text-slate-900">{stu.name}</p>
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.2 font-mono text-[12px] font-bold text-slate-600">
                              STU-{stu.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {stu.course}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                        ₹{Number(stu.paidFees || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={stu.paymentStatus || "Active"} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/students/${stu.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-purple-200/80 bg-purple-50/60 px-2.5 py-1 text-[13px] font-bold text-purple-700 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all"
                        >
                          <Eye size={12} />
                          <span>Profile</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
