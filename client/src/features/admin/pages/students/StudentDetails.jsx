import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Award,
  BookOpen,
  Edit,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  Loader2,
  PhoneCall,
  MessageSquare,
  Hash,
  Layers,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import api from "../../../../services/api";

const getCourseBadgeStyle = (name = "") => {
  const lower = name.toLowerCase();
  if (
    lower.includes("full stack") ||
    lower.includes("web") ||
    lower.includes("frontend") ||
    lower.includes("backend")
  ) {
    return {
      gradient: "from-blue-600 to-indigo-600",
      batchBg: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
    };
  }
  if (
    lower.includes("data") ||
    lower.includes("ai") ||
    lower.includes("machine") ||
    lower.includes("intelligence")
  ) {
    return {
      gradient: "from-purple-600 to-pink-600",
      batchBg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/70",
    };
  }
  if (
    lower.includes("mobile") ||
    lower.includes("app") ||
    lower.includes("flutter") ||
    lower.includes("react native")
  ) {
    return {
      gradient: "from-emerald-600 to-teal-600",
      batchBg: "bg-teal-50 text-teal-700 border-teal-200/70",
    };
  }
  if (
    lower.includes("python") ||
    lower.includes("dsa") ||
    lower.includes("algo") ||
    lower.includes("cloud")
  ) {
    return {
      gradient: "from-amber-600 to-orange-600",
      batchBg: "bg-orange-50 text-orange-700 border-orange-200/70",
    };
  }
  return {
    gradient: "from-cyan-600 to-blue-600",
    batchBg: "bg-sky-50 text-[13px]ky-700 border-sky-200/70",
  };
};

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/students/${id}`);
      if (res.data.success) {
        setStudent(res.data.data.student);
      }
    } catch {
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-xs font-semibold text-[13px]late-500">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <span>Loading student profile records...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-base font-bold text-[13px]late-800">Student Not Found</h3>
        <p className="mt-1 text-xs text-[13px]late-500">Record #{id} could not be located.</p>
        <Link
          to="/admin/students"
          className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Return to Student Directory
        </Link>
      </div>
    );
  }

  const primaryCourse = student.enrolledCourses?.[0]?.name || "Full Stack Web Development";
  const primaryBatch = student.enrolledBatches?.[0]?.name || "Weekend Live Cohort";
  const courseStyle = getCourseBadgeStyle(primaryCourse);
  const regNo = student.registrationNumber || `AV-STU-${String(student.id).padStart(4, "0")}`;

  const rawPhone = student.phone || "";
  const digits = rawPhone.replace(/\D/g, "");
  const waNumber = digits.length === 10 ? `91${digits}` : digits;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello ${student.name}, greetings from Apna Vidya!`
  )}`;
  const telUrl = `tel:${rawPhone}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Student Profile: ${student.name}`}
        description={`Registration: ${regNo} • Batch: ${primaryBatch}`}
        breadcrumbs={[
          { label: "Students", path: "/admin/students" },
          { label: student.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </Link>
            <a
              href={telUrl}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/90 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
            >
              <PhoneCall size={14} />
              <span>Normal Call</span>
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </a>
            <Link
              to={`/admin/students/${student.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Edit size={15} />
              <span>Edit Profile</span>
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                student.profileImage ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              }
              alt={student.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-[13px]late-900">
                  {student.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/90 px-2.5 py-0.5 text-xs font-mono font-bold text-violet-700 shadow-2xs">
                  <Hash size={12} className="text-violet-500" />
                  <span>{regNo}</span>
                </span>
                <StatusBadge status={student.status || "Active"} />
              </div>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${courseStyle.gradient} px-2.5 py-1 text-xs font-bold text-white shadow-xs`}>
                  <BookOpen size={12} className="text-white/90" />
                  <span>{primaryCourse}</span>
                </span>
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[13px] font-semibold border ${courseStyle.batchBg}`}>
                  <Layers size={11} />
                  <span>{primaryBatch}</span>
                </span>
              </div>
              <p className="text-[13px] font-mono text-[13px]late-400 mt-1">
                Database Record #{student.id} • Enrolled: {student.admissionDate || "2026-07-02"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6 text-xs">
            <div>
              <p className="text-[13px]late-400">Total Fees</p>
              <p className="font-bold text-[13px]late-900 font-mono text-[13px]m">
                ₹{(student.totalFees || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[13px]late-400">Paid Fees</p>
              <p className="font-bold text-emerald-600 font-mono text-[13px]m">
                ₹{(student.paidFees || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[13px]late-400">Pending Fees</p>
              <p className="font-bold text-rose-600 font-mono text-[13px]m">
                ₹{(student.pendingFees || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[13px]late-400">Attendance</p>
              <p className="font-bold text-[13px]late-900 font-mono text-[13px]m">
                {student.attendance || 94}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-slate-100 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "course", label: "Course & Batch" },
            { id: "payments", label: "Payment Ledger" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-[13px]late-500 hover:text-[13px]late-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 text-xs">
              <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <h4 className="font-bold text-[13px]late-900 uppercase tracking-wider text-[13px]">
                  Contact & Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px]late-500">Registration Number</span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-violet-100/70 border border-violet-200 px-2 py-0.5 text-xs font-mono font-bold text-violet-800">
                      <Hash size={11} className="text-violet-600" />
                      {regNo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px]late-500">Email Address</span>
                    <span className="font-medium text-[13px]late-800">{student.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px]late-500">Phone / WhatsApp</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium font-mono text-[13px]late-800">{student.phone}</span>
                      <a
                        href={telUrl}
                        className="rounded-md bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white px-2 py-0.5 text-[12px] font-bold transition-colors inline-flex items-center gap-1"
                        title="Call"
                      >
                        <PhoneCall size={10} />
                        <span>Call</span>
                      </a>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white px-2 py-0.5 text-[12px] font-bold transition-colors inline-flex items-center gap-1"
                        title="WhatsApp"
                      >
                        <MessageSquare size={10} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px]late-500">Gender</span>
                    <span className="font-medium text-[13px]late-800">{student.gender || "Male"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px]late-500">Date of Birth</span>
                    <span className="font-medium text-[13px]late-800">{student.dob || "2002-05-14"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px]late-500">Address</span>
                    <span className="font-medium text-[13px]late-800 text-right max-w-[200px]">
                      {student.address || "Noida, UP"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <h4 className="font-bold text-[13px]late-900 uppercase tracking-wider text-[13px]">
                  Academic Progress Notes
                </h4>
                <p className="text-[13px]late-700 leading-relaxed">
                  {student.notes || "No additional mentor notes recorded."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "course" && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${courseStyle.gradient} px-2.5 py-1 text-xs font-bold text-white shadow-xs`}>
                    <BookOpen size={12} className="text-white/90" />
                    <span>{primaryCourse}</span>
                  </span>
                </div>
                <p className="text-[13px]late-600 mt-2">Assigned Cohort Batch: <strong className="text-[13px]late-800">{primaryBatch}</strong></p>
                <div className="mt-4 flex items-center gap-2">
                  <StatusBadge status={student.paymentStatus || "Paid"} />
                  <span className="text-[13px]late-500">Fee status: {student.paymentStatus || "Paid"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-4 flex justify-between items-center bg-slate-50/50 font-bold text-[13px]late-700">
                <span>Tuition Total: ₹{(student.totalFees || 0).toLocaleString()}</span>
                <span className="text-emerald-700">Total Paid: ₹{(student.paidFees || 0).toLocaleString()}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-[13px]late-800">Tuition Installment Deposit</p>
                  <p className="text-[13px] text-[13px]late-400">Date: {student.admissionDate || "2026-07-02"}</p>
                </div>
                <span className="font-mono font-bold text-emerald-600">₹{(student.paidFees || 0).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
