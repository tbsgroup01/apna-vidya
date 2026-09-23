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
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import api from "../../../../services/api";

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
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <span>Loading student profile records...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-base font-bold text-slate-800">Student Not Found</h3>
        <p className="mt-1 text-xs text-slate-500">Record #{id} could not be located.</p>
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Student Profile: ${student.name}`}
        description={`Enrolled learner ID: #${student.id} • Batch: ${primaryBatch}`}
        breadcrumbs={[
          { label: "Students", path: "/admin/students" },
          { label: student.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </Link>
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
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {student.name}
                </h2>
                <StatusBadge status={student.status || "Active"} />
              </div>
              <p className="text-xs font-semibold text-blue-600 mt-1">
                {primaryCourse}
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                ID: #{student.id} • Enrolled: {student.admissionDate || "2026-07-02"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6 text-xs">
            <div>
              <p className="text-slate-400">Total Fees</p>
              <p className="font-bold text-slate-900 font-mono text-sm">
                ₹{(student.totalFees || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Paid Fees</p>
              <p className="font-bold text-emerald-600 font-mono text-sm">
                ₹{(student.paidFees || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Pending Fees</p>
              <p className="font-bold text-rose-600 font-mono text-sm">
                ₹{(student.pendingFees || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Attendance</p>
              <p className="font-bold text-slate-900 font-mono text-sm">
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
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
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
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Contact & Personal Information
                </h4>
                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email Address</span>
                    <span className="font-medium text-slate-800">{student.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone / WhatsApp</span>
                    <span className="font-medium font-mono text-slate-800">{student.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gender</span>
                    <span className="font-medium text-slate-800">{student.gender || "Male"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date of Birth</span>
                    <span className="font-medium text-slate-800">{student.dob || "2002-05-14"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Address</span>
                    <span className="font-medium text-slate-800 text-right max-w-[200px]">
                      {student.address || "Noida, UP"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Academic Progress Notes
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {student.notes || "No additional mentor notes recorded."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "course" && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-slate-200 p-5">
                <h4 className="font-bold text-slate-900 mb-2">{primaryCourse}</h4>
                <p className="text-slate-600">Assigned Cohort Batch: <strong className="text-slate-800">{primaryBatch}</strong></p>
                <div className="mt-4 flex items-center gap-2">
                  <StatusBadge status={student.paymentStatus || "Paid"} />
                  <span className="text-slate-500">Fee status: {student.paymentStatus || "Paid"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-4 flex justify-between items-center bg-slate-50/50 font-bold text-slate-700">
                <span>Tuition Total: ₹{(student.totalFees || 0).toLocaleString()}</span>
                <span className="text-emerald-700">Total Paid: ₹{(student.paidFees || 0).toLocaleString()}</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">Tuition Installment Deposit</p>
                  <p className="text-[11px] text-slate-400">Date: {student.admissionDate || "2026-07-02"}</p>
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
