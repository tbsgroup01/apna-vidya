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
          const { stats: liveStats, recentLeads: liveLeads, recentStudents: liveStudents, coursePopularity: livePop } = res.data.data;

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
            setRecentStudents(liveStudents.map((s) => ({
              id: s.id,
              name: s.name,
              course: s.enrolledCourses?.[0]?.name || "Full Stack Web Development",
              paidFees: s.paidFees || 0,
              paymentStatus: s.paymentStatus || "Paid",
              avatar: s.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            })));
          }

          if (livePop && livePop.length > 0) {
            setCoursePopularity(livePop.map((c) => ({
              course: c.name,
              count: c.studentsCount || 0,
              enrolled: c.studentsCount || 0,
              percentage: Math.min(100, (c.studentsCount + 1) * 15),
            })));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardStats();
  }, []);

  const quickActions = [
    { label: "Add Student", path: "/admin/students/create", icon: UserPlus, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "Add Course", path: "/admin/courses/create", icon: BookPlus, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
    { label: "Add Blog", path: "/admin/blogs/create", icon: FilePlus2, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
    { label: "Awards & Honors", path: "/admin/certificates", icon: Award, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
    { label: "Post Announcement", path: "/admin/notifications", icon: BellRing, color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Live Administrative Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time Apna Vidya operations, student admissions, and catalog health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <span>View All Enquiries</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className={`flex items-center gap-2.5 rounded-xl border border-slate-100 p-3 text-xs font-bold transition-all ${action.color}`}
              >
                <Icon size={17} />
                <span className="truncate">{action.label}</span>
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
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Student Enrollment Growth
              </h3>
              <p className="text-xs text-slate-500">Monthly new registered learners</p>
            </div>
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
              2026 Trend
            </span>
          </div>
          <EnrollmentLineChart data={enrollmentChartData} />
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Revenue Collection (in ₹ Lakhs)
              </h3>
              <p className="text-xs text-slate-500">Gross fee collections across batches</p>
            </div>
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
              +14.8% MoM
            </span>
          </div>
          <RevenueBarChart data={revenueChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Most Enrolled Programs
              </h3>
              <p className="text-xs text-slate-500">
                Course popularity and active student distribution
              </p>
            </div>
            <Link
              to="/admin/courses"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Courses
            </Link>
          </div>
          <CoursePopularityBars data={coursePopularity} />
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Lead Conversion Ratio
            </h3>
            <p className="text-xs text-slate-500">Enquiry to paid admission funnel</p>
          </div>
          <LeadConversionDonut data={leadConversionData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Leads</h3>
              <p className="text-xs text-slate-500">Latest website & demo class enquiries</p>
            </div>
            <Link
              to="/admin/leads"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{lead.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{lead.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {lead.course}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{lead.source}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Students</h3>
              <p className="text-xs text-slate-500">Newly enrolled students and status</p>
            </div>
            <Link
              to="/admin/students"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                  <tr key={stu.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={stu.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                          alt={stu.name}
                          className="h-7 w-7 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{stu.name}</p>
                          <p className="text-[11px] text-slate-400">STU-{stu.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {stu.course}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                      ₹{Number(stu.paidFees || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={stu.paymentStatus || "Active"} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/students/${stu.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
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

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Fee Transactions</h3>
            <p className="text-xs text-slate-500">Live payment audit entries and receipts</p>
          </div>
          <Link
            to="/admin/payments"
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            All Payments
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">
                    {pay.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{pay.studentName}</p>
                    <p className="text-[11px] text-slate-400">{pay.course}</p>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    ₹{pay.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{pay.method}</td>
                  <td className="px-4 py-3 text-slate-400">{pay.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pay.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/payments/${pay.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
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
