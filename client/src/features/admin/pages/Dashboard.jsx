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
  dashboardStats as defaultStats,
  enrollmentChartData,
  revenueChartData,
  coursePopularityData as defaultPopularity,
  leadConversionData,
} from "../../../data/admin/dashboardData";
import {
  EnrollmentLineChart,
  RevenueBarChart,
  CoursePopularityBars,
  LeadConversionDonut,
} from "../components/ChartComponents";
import { initialLeads } from "../../../data/admin/leadsData";
import { initialStudents } from "../../../data/admin/studentsData";
import { initialPayments } from "../../../data/admin/paymentsData";
import api from "../../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [recentLeads, setRecentLeads] = useState(initialLeads.slice(0, 5));
  const [recentStudents, setRecentStudents] = useState(initialStudents.slice(0, 5));
  const [coursePopularity, setCoursePopularity] = useState(defaultPopularity);
  const [recentPayments] = useState(initialPayments.slice(0, 5));

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get("/admin/dashboard/stats");
        if (res.data?.data) {
          const {
            stats: liveStats,
            recentLeads: liveLeads,
            recentStudents: liveStudents,
            coursePopularity: livePop,
          } = res.data.data;

          if (liveStats) {
            setStats([
              {
                id: "stat-1",
                title: "Total Registered Learners",
                value: liveStats.totalStudents.toLocaleString(),
                trend: 12,
                trendLabel: "Live database records",
                icon: Users,
                color: "blue",
              },
              {
                id: "stat-2",
                title: "Active Course Programs",
                value: liveStats.activeCourses.toLocaleString(),
                trend: 8,
                trendLabel: "Published on portal",
                icon: BookOpen,
                color: "indigo",
              },
              {
                id: "stat-3",
                title: "Live Classroom Batches",
                value: liveStats.activeBatches.toLocaleString(),
                trend: 15,
                trendLabel: "Conducted by mentors",
                icon: Calendar,
                color: "purple",
              },
              {
                id: "stat-4",
                title: "Gross Fee Collection",
                value: `₹${Math.round(liveStats.totalRevenue).toLocaleString()}`,
                trend: 18,
                trendLabel: "Reconciled tuition",
                icon: IndianRupee,
                color: "emerald",
              },
            ]);
          }

          if (liveLeads && liveLeads.length > 0) {
            setRecentLeads(liveLeads);
          }

          if (liveStudents && liveStudents.length > 0) {
            setRecentStudents(
              liveStudents.map((s) => ({
                id: s.id,
                name: s.name,
                course: s.enrolledCourses?.[0]?.name || "Full Stack Web Development",
                paidFees: s.paidFees || 0,
                paymentStatus: s.paymentStatus || "Paid",
                avatar:
                  s.profileImage ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
              }))
            );
          }

          if (livePop && livePop.length > 0) {
            setCoursePopularity(
              livePop.map((c) => ({
                course: c.name,
                count: c.studentsCount || 0,
                enrolled: c.studentsCount || 0,
                percentage: Math.min(100, (c.studentsCount + 1) * 15),
              }))
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardStats();
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
      textColor: "text-[13px]late-900",
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
      textColor: "text-[13px]late-900",
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
      textColor: "text-[13px]late-900",
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
      textColor: "text-[13px]late-900",
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
      textColor: "text-[13px]late-900",
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
            <h1 className="text-2xl font-black tracking-tight text-[13px]late-900 sm:text-3xl">
              Live Administrative Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-[13px]m text-[13px]late-500 max-w-2xl">
              Real-time student admissions, fees reconciliation, courses health, and institutional workflows for Apna Vidya.
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
            <p className="text-xs font-bold uppercase tracking-wider text-[13px]late-700">
              Quick Management Actions
            </p>
          </div>
          <span className="text-[13px] font-semibold text-[13px]late-400">Instant shortcuts</span>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/40 via-white to-sky-50/20 p-5 shadow-xs hover:border-blue-300 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs">
                <Users size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[13px]late-900">
                  Student Enrollment Growth
                </h3>
                <p className="text-xs text-[13px]late-500">Monthly new registered learners</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
              <TrendingUp size={12} />
              <span>2026 Trend</span>
            </span>
          </div>
          <EnrollmentLineChart data={enrollmentChartData} />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 p-5 shadow-xs hover:border-emerald-300 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
                <IndianRupee size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[13px]late-900">
                  Revenue Collection (in ₹ Lakhs)
                </h3>
                <p className="text-xs text-[13px]late-500">Gross fee collections across batches</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
              <TrendingUp size={12} />
              <span>+14.8% MoM</span>
            </span>
          </div>
          <RevenueBarChart data={revenueChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/40 via-white to-fuchsia-50/20 p-5 shadow-xs hover:border-purple-300 transition-all lg:col-span-2">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xs">
                <BookOpen size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[13px]late-900">
                  Most Enrolled Programs
                </h3>
                <p className="text-xs text-[13px]late-500">
                  Course popularity and active student distribution
                </p>
              </div>
            </div>
            <Link
              to="/admin/courses"
              className="inline-flex items-center gap-1 rounded-xl bg-purple-100/90 border border-purple-200/60 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-600 hover:text-white transition-all shadow-2xs"
            >
              <span>View Courses</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <CoursePopularityBars data={coursePopularity} />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 p-5 shadow-xs hover:border-amber-300 transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600" />
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
              <Target size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[13px]late-900">
                Lead Conversion Ratio
              </h3>
              <p className="text-xs text-[13px]late-500">Enquiry to paid admission funnel</p>
            </div>
          </div>
          <LeadConversionDonut data={leadConversionData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-white shadow-xs">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Target size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[13px]late-900">Recent Inquiries</h3>
                <p className="text-xs text-[13px]late-500">Latest website & demo inquiries</p>
              </div>
            </div>
            <Link
              to="/admin/leads"
              className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200/60 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gradient-to-r from-blue-50/70 via-slate-50 to-blue-50/30 border-b border-blue-100/70 text-[13px] font-bold uppercase tracking-wider text-[13px]late-600">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.map((lead, idx) => {
                  const avatarGrad = leadAvatarColors[idx % leadAvatarColors.length];
                  return (
                    <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarGrad} font-black text-white text-xs shadow-xs`}
                          >
                            {lead.name?.charAt(0) || "L"}
                          </span>
                          <div>
                            <p className="font-bold text-[13px]late-900">{lead.name}</p>
                            <p className="text-[13px] text-[13px]late-400 font-mono">{lead.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px]late-700 font-medium">
                        {lead.course}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[13px] font-medium text-[13px]late-600 border border-slate-200/60">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/admin/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-200/80 bg-blue-50/60 px-2.5 py-1 text-[13px] font-bold text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
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
                <h3 className="text-base font-bold text-[13px]late-900">Recent Students</h3>
                <p className="text-xs text-[13px]late-500">Newly enrolled students</p>
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
              <thead className="bg-gradient-to-r from-purple-50/70 via-slate-50 to-purple-50/30 border-b border-purple-100/70 text-[13px] font-bold uppercase tracking-wider text-[13px]late-600">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Fees Paid</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            stu.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                          }
                          alt={stu.name}
                          className="h-8 w-8 rounded-xl object-cover ring-2 ring-purple-200"
                        />
                        <div>
                          <p className="font-bold text-[13px]late-900">{stu.name}</p>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.2 font-mono text-[12px] font-bold text-[13px]late-600">
                            STU-{stu.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px]late-700 font-medium">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CreditCard size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[13px]late-900">Recent Fee Transactions</h3>
              <p className="text-xs text-[13px]late-500">Live payment audit entries and receipts</p>
            </div>
          </div>
          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all"
          >
            <span>All Payments</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-emerald-50/70 via-slate-50 to-emerald-50/30 border-b border-emerald-100/70 text-[13px] font-bold uppercase tracking-wider text-[13px]late-600">
              <tr>
                <th className="px-4 py-3">Receipt / ID</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-blue-50 border border-blue-200/60 px-2 py-0.5 font-mono font-bold text-blue-700 text-[13px]">
                      {pay.id}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[13px]late-900">{pay.studentName}</p>
                    <p className="text-[13px] text-[13px]late-400">{pay.course}</p>
                  </td>
                  <td className="px-4 py-3 font-mono font-black text-emerald-700 text-[13px]m">
                    ₹{pay.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[13px] font-medium text-[13px]late-700 border border-slate-200/60">
                      {pay.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px]late-500 font-mono text-[13px]">{pay.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pay.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/payments/${pay.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200/80 bg-emerald-50/60 px-2.5 py-1 text-[13px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                    >
                      <Eye size={12} />
                      <span>Receipt</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
