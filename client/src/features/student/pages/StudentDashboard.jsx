import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  Video,
  Clock,
  CheckCircle2,
  Download,
  FileText,
  ExternalLink,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FolderDown,
  Layers,
  Check,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("curriculum");
  const [downloadNotice, setDownloadNotice] = useState("");

  const studentInfo = {
    name: user?.name || "Rahul Sharma",
    rollNo: "STU-2026-001",
    course: "Full Stack Web Development (MERN)",
    batch: "FS-JUL-26 (Weekend Live)",
    trainer: "Amit Verma (Senior Staff Architect)",
    progressPercent: 78,
    attendance: 94,
    assignmentsDone: 18,
    assignmentsTotal: 20,
    feeStatus: "Paid",
    totalFee: 32000,
    paidFee: 32000,
    dueFee: 0,
  };

  const modules = [
    {
      title: "Module 1: Modern Frontend & Responsive UI",
      topics: ["Semantic HTML5, CSS3, Flexbox & CSS Grid", "Responsive Design Systems & Tailwind CSS", "Modern JavaScript (ES6+), Async/Await, DOM"],
      status: "Completed",
    },
    {
      title: "Module 2: Advanced React & State Management",
      topics: ["React Components, Hooks, Context API", "Vite Tooling & Single Page Applications", "Axios Interceptors & Authentication Flow"],
      status: "Completed",
    },
    {
      title: "Module 3: Backend Engineering with Node.js & Express",
      topics: ["RESTful API Architecture & Routing", "Sequelize ORM & Relational MySQL Modeling", "JWT Authentication, Cookies & Password Hashing"],
      status: "In Progress",
    },
    {
      title: "Module 4: Full Stack Capstone & Cloud Deployment",
      topics: ["Role-Based Access Control (RBAC)", "Payment Gateway Integration", "CI/CD & Production Server Deployment"],
      status: "Upcoming",
    },
  ];

  const upcomingClasses = [
    {
      date: "Saturday, 27 Sept 2026",
      time: "10:00 AM - 01:00 PM IST",
      topic: "Advanced Sequelize Transactions & Relational Hooks",
      trainer: "Amit Verma",
      link: "#join-live-class",
      isToday: true,
    },
    {
      date: "Sunday, 28 Sept 2026",
      time: "10:00 AM - 01:00 PM IST",
      topic: "Building Secure JWT Authentication & RBAC Gateways",
      trainer: "Amit Verma",
      link: "#join-live-class",
      isToday: false,
    },
  ];

  const materials = [
    {
      title: "Express.js Architecture & Routing Master Cheatsheet",
      category: "PDF Guide",
      size: "2.4 MB",
      date: "20 Sept 2026",
    },
    {
      title: "Sequelize ORM Cheatsheet & Migration Recipes",
      category: "PDF Guide",
      size: "3.1 MB",
      date: "18 Sept 2026",
    },
    {
      title: "MERN Stack Production Capstone Starter Template",
      category: "Source Code",
      size: "14.2 MB",
      date: "15 Sept 2026",
    },
    {
      title: "Full Stack Interview Questions & System Design Notes",
      category: "E-Book",
      size: "5.8 MB",
      date: "10 Sept 2026",
    },
  ];

  const transactions = [
    {
      id: "PAY-9812",
      amount: "₹16,000",
      date: "02 Jul 2026",
      method: "UPI / PhonePe",
      status: "Success",
      note: "1st Installment (Admission Fee)",
    },
    {
      id: "PAY-9934",
      amount: "₹16,000",
      date: "05 Aug 2026",
      method: "Net Banking (HDFC)",
      status: "Success",
      note: "Final Installment (Course Cleared)",
    },
  ];

  const handleDownload = (fileName) => {
    setDownloadNotice(`Downloading "${fileName}"...`);
    setTimeout(() => {
      setDownloadNotice("");
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-600 px-4 py-3 text-[13px]m font-semibold text-white shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} />
          <span>{downloadNotice}</span>
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:p-10 mb-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles size={13} />
                Student Learning Portal
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                Enrolled & Verified
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
              Welcome back, {studentInfo.name} 👋
            </h1>
            <p className="mt-2 text-[13px]m text-[13px]late-300 sm:text-base">
              You are enrolled in{" "}
              <strong className="text-white font-semibold">{studentInfo.course}</strong>.
              Keep up your streak and attend the live weekend cohort!
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-[13px]late-300">
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-blue-400" />
                Batch: {studentInfo.batch}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-indigo-400" />
                Trainer: {studentInfo.trainer}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0">
            <a
              href="#live-class"
              onClick={(e) => {
                e.preventDefault();
                alert("Joining ApnaVidya Live Classroom. Loading stream...");
              }}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#FD8006] px-6 py-3.5 text-[13px]m font-bold text-white shadow-lg shadow-blue-500/40 hover:bg-blue-500 hover:shadow-blue-500/60 active:scale-95 transition-all cursor-pointer"
            >
              <Video size={18} />
              <span>Join Today's Live Class</span>
            </a>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xs px-4 py-2.5 text-center text-xs text-[13px]late-300">
              Next session: <span className="font-bold text-white">Sat 10:00 AM IST</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[13px]late-500">
              Program Progress
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BookOpen size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-[13px]late-900">{studentInfo.progressPercent}%</p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-[#FD8006] h-2 rounded-full transition-all duration-500"
              style={{ width: `${studentInfo.progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] font-semibold text-[13px]late-500">Module 3 of 4 in progress</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[13px]late-500">
              Attendance
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-[13px]late-900">{studentInfo.attendance}%</p>
          <p className="mt-3 text-xs font-bold text-emerald-600">Excellent Standing</p>
          <p className="mt-1 text-[13px] text-[13px]late-500">47 of 50 sessions attended</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[13px]late-500">
              Assignments
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-[13px]late-900">
            {studentInfo.assignmentsDone} / {studentInfo.assignmentsTotal}
          </p>
          <p className="mt-3 text-xs font-bold text-indigo-600">90% Completion Rate</p>
          <p className="mt-1 text-[13px] text-[13px]late-500">2 assignments under review</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[13px]late-500">
              Tuition Status
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700">₹{studentInfo.paidFee.toLocaleString()}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[12px] font-extrabold text-emerald-800">
            <Check size={12} />
            All Fees Cleared
          </span>
          <p className="mt-1 text-[13px] text-[13px]late-500">Zero pending balance</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${activeTab === "curriculum"
            ? "bg-[#FD8006] text-white shadow-sm"
            : "bg-white text-[13px]late-700 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Layers size={15} />
          <span>Curriculum & Progress</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schedule")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${activeTab === "schedule"
            ? "bg-[#FD8006] text-white shadow-sm"
            : "bg-white text-[13px]late-700 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Calendar size={15} />
          <span>Live Batches & Schedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("materials")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${activeTab === "materials"
            ? "bg-[#FD8006] text-white shadow-sm"
            : "bg-white text-[13px]late-700 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <FolderDown size={15} />
          <span>Study Materials & Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${activeTab === "ledger"
            ? "bg-[#FD8006] text-white shadow-sm"
            : "bg-white text-[13px]late-700 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <CreditCard size={15} />
          <span>Fee Ledger & Receipts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${activeTab === "certificates"
            ? "bg-[#FD8006] text-white shadow-sm"
            : "bg-white text-[13px]late-700 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Award size={15} />
          <span>My Certificates</span>
        </button>
      </div>

      {activeTab === "curriculum" && (
        <div className="space-y-4 animate-in fade-in">
          {modules.map((mod, index) => (
            <div
              key={mod.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-xs font-extrabold text-blue-700">
                    0{index + 1}
                  </span>
                  <h3 className="text-base font-bold text-[13px]late-900">{mod.title}</h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold w-fit ${mod.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800"
                    : mod.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-[13px]late-600"
                    }`}
                >
                  {mod.status === "Completed" && <CheckCircle2 size={13} />}
                  {mod.status}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {mod.topics.map((topic) => (
                  <div key={topic} className="flex items-center gap-2.5 text-xs text-[13px]late-700">
                    <CheckCircle2
                      size={15}
                      className={mod.status === "Completed" ? "text-emerald-500" : "text-[13px]late-300"}
                    />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingClasses.map((item) => (
              <div
                key={item.topic}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      <Calendar size={13} />
                      {item.date}
                    </span>
                    {item.isToday && (
                      <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[12px] font-extrabold text-rose-700 animate-pulse">
                        Today
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[13px]late-900">{item.topic}</h4>
                  <p className="mt-2 text-xs text-[13px]late-500 flex items-center gap-1.5">
                    <Clock size={14} className="text-[13px]late-400" />
                    <span>{item.time}</span>
                  </p>
                  <p className="mt-1 text-xs text-[13px]late-500 flex items-center gap-1.5">
                    <Users size={14} className="text-[13px]late-400" />
                    <span>Instructor: {item.trainer}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Launching live session: ${item.topic}`)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FD8006] py-2.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-98 transition-all cursor-pointer"
                >
                  <Video size={16} />
                  <span>Join Live Classroom</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "materials" && (
        <div className="space-y-3 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {materials.map((file) => (
              <div
                key={file.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[13px]late-800 truncate">{file.title}</h4>
                    <p className="text-[13px] text-[13px]late-500 mt-0.5">
                      {file.category} • {file.size} • Uploaded {file.date}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(file.title)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-[13px]late-600 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"
                  title="Download File"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "ledger" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-[13px]m font-bold text-[13px]late-900">Student Fee History</h3>
                <p className="text-xs text-[13px]late-500">Official tuition payment ledger</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                100% Cleared
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[13px]late-800">{tx.id}</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold text-[13px]late-600">
                        {tx.method}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[13px]late-700 mt-1">{tx.note}</p>
                    <p className="text-[13px] text-[13px]late-400 mt-0.5">Date: {tx.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[13px]m font-extrabold text-[13px]late-900">{tx.amount}</p>
                    <button
                      type="button"
                      onClick={() => handleDownload(`Receipt_${tx.id}.pdf`)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "certificates" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FD8006] text-white shadow-lg shadow-blue-500/30">
                  <Award size={28} />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[12px] font-extrabold text-emerald-800">
                    <ShieldCheck size={12} />
                    ISO 9001:2015 Verified
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold text-[13px]late-900">
                    Certificate of Excellence in Full Stack Development
                  </h3>
                  <p className="text-xs text-[13px]late-600 mt-1">
                    Issued to <strong className="text-[13px]late-800 font-semibold">{studentInfo.name}</strong> • Certificate ID:{" "}
                    <span className="font-mono font-bold text-blue-700">AV-2025-0842</span>
                  </p>
                  <p className="text-[13px] text-[13px]late-500 mt-1">
                    Graduation Date: 30 August 2026 • Issued by ApnaVidya Council
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload("ApnaVidya_Certificate_AV-2025-0842.pdf")}
                  className="flex items-center gap-2 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download PDF</span>
                </button>
                <Link
                  to="/verify-certificate"
                  target="_blank"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50"
                >
                  <ExternalLink size={14} className="text-[13px]late-400" />
                  <span>Verify Online</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <HelpCircle size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[13px]late-900">Need academic help or doubt resolution?</h4>
            <p className="text-[13px] text-[13px]late-500">
              Your mentor Amit Verma and counsellor Sneha Patel are available Mon-Sat, 9AM-7PM.
            </p>
          </div>
        </div>
        <a
          href="mailto:support@apnavidya.com"
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50"
        >
          Contact Support Desk
        </a>
      </div>
    </div>
  );
};

export default StudentDashboard;
