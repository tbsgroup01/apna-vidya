import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Users,
  CheckCircle,
  GraduationCap,
  AlertCircle,
  Loader2,
  PhoneCall,
  Hash,
  BookOpen,
  Layers,
  Receipt,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import api from "../../../../services/api";

const WhatsAppIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z" />
  </svg>
);

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

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students?limit=100");
      if (res.data.success) {
        setStudents(res.data.data.students || []);
      }
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const totalPaid = students.reduce((acc, s) => acc + (s.paidFees || 0), 0);
  const totalPending = students.reduce((acc, s) => acc + (s.pendingFees || 0), 0);

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await api.delete(`/admin/students/${studentToDelete.id}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove student");
    }
  };

  const handleBulkDeletePrompt = (ids) => {
    setSelectedStudentIds(ids);
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!selectedStudentIds.length) return;
    try {
      const res = await api.post("/admin/students/bulk-delete", { ids: selectedStudentIds });
      if (res.data.success) {
        setStudents((prev) => prev.filter((s) => !selectedStudentIds.includes(s.id)));
        setBulkDeleteModalOpen(false);
        setSelectedStudentIds([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to bulk delete students");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Student Directory",
      sortable: true,
      render: (row) => {
        const regNo =
          row.registrationNumber ||
          `AV-STU-${String(row.id).padStart(4, "0")}`;
        return (
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div
                className="h-10 w-10 rounded-xl bg-slate-100 bg-cover bg-no-repeat ring-2 ring-blue-500/20 shadow-xs"
                style={{
                  backgroundImage: `url("${row.profileImage ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    }")`,
                  backgroundPosition: "top center",
                  backgroundSize: "cover",
                }}
                role="img"
                aria-label={row.name}
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                <CheckCircle size={10} className="text-white" />
              </span>
            </div>
            <div className="space-y-1">
              <Link
                to={`/admin/students/${row.id}`}
                className="font-bold text-slate-900 hover:text-blue-600 transition-colors block text-sm"
              >
                {row.name}
              </Link>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/80 px-2 py-0.5 text-xs font-mono font-bold text-violet-700 shadow-2xs">
                  <Hash size={11} className="text-violet-500" />
                  <span>{regNo}</span>
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
                  {row.gender || "Student"}
                </span>
                <StatusBadge status={row.status || "Active"} size="xs" />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[13px]late-800">
            <Phone size={12} className="text-[13px]late-400 shrink-0" />
            <span>{row.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1 text-[13px] text-[13px]late-500 truncate max-w-[170px]">
            <Mail size={11} className="text-[13px]late-400 shrink-0" />
            <span className="truncate">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course Programs",
      sortable: true,
      render: (row) => {
        const courseName =
          row.enrolledCourses?.[0]?.name || "Full Stack Web Development";
        const batchName = row.enrolledBatches?.[0]?.name || "Regular Batch";
        const style = getCourseBadgeStyle(courseName);

        return (
          <div className="space-y-1.5">
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${style.gradient} px-2.5 py-1 text-xs font-bold text-white shadow-xs transition-transform hover:scale-102`}
            >
              <BookOpen size={12} className="shrink-0 text-white/90" />
              <span className="truncate max-w-[190px]">{courseName}</span>
            </div>

          </div>
        );
      },
    },


    {
      key: "fees",
      header: "Fee Status",
      sortable: true,
      render: (row) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-slate-900">
              ₹{(row.paidFees || 0).toLocaleString()}
            </span>
            <span className="text-[12px] text-slate-400">
              / ₹{(row.totalFees || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={row.paymentStatus || "Pending"} size="sm" />
            <Link
              to={`/admin/payments/${row.id}`}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/90 px-2 py-0.5 text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
              title="View / Print Official Fee Receipt"
            >
              <Receipt size={12} />
              <span>Receipt</span>
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "quickConnect",
      header: "Contact",
      align: "center",
      render: (row) => {
        const rawPhone = row.phone || "";
        const digits = rawPhone.replace(/\D/g, "");
        const waNumber = digits.length === 10 ? `91${digits}` : digits;
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
          `Hello ${row.name}, greetings from Apna Vidya!`
        )}`;
        const telUrl = `tel:${rawPhone}`;

        return (
          <div className="flex items-center justify-center gap-2">
            <a
              href={telUrl}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200/80 shadow-2xs transition-all cursor-pointer active:scale-95"
              title={`Call ${row.name} (${rawPhone})`}
            >
              <PhoneCall size={15} />
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/80 shadow-2xs transition-all cursor-pointer active:scale-95"
              title={`Chat on WhatsApp with ${row.name}`}
            >
              <WhatsAppIcon size={16} />
            </a>
          </div>
        );
      },
    },
    {
      key: "admissionDate",
      header: "Joined Date",
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 font-mono text-[13px] font-medium">
          {row.admissionDate || "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/admin/payments/${row.id}`}
            className="rounded-lg p-1.5 text-emerald-600 bg-emerald-50/80 hover:bg-emerald-600 hover:text-white transition-colors"
            title="View Official Fee Receipt"
          >
            <Receipt size={15} />
          </Link>
          <Link
            to={`/admin/students/${row.id}`}
            className="rounded-lg p-1.5 text-blue-600 bg-blue-50/70 hover:bg-blue-600 hover:text-white transition-colors"
            title="View Student Profile"
          >
            <Eye size={15} />
          </Link>
          <Link
            to={`/admin/students/${row.id}/edit`}
            className="rounded-lg p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-700 hover:text-white transition-colors"
            title="Edit Details"
          >
            <Edit size={15} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-rose-600 bg-rose-50/70 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
            title="Archive Student"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleCustomSearch = (item, q) => {
    const regNo =
      item.registrationNumber || `AV-STU-${String(item.id).padStart(4, "0")}`;
    const courseName = item.enrolledCourses?.[0]?.name || "";
    const batchName = item.enrolledBatches?.[0]?.name || "";
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      regNo.toLowerCase().includes(q) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      courseName.toLowerCase().includes(q) ||
      batchName.toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Directory"
        description="Comprehensive record of all enrolled learners, course batches, and academic progress."
        breadcrumbs={[{ label: "Students" }]}
        actions={
          <button
            type="button"
            onClick={() => navigate("/admin/students/create")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Enroll Student</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Enrolled Students"
          value={students.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Learners"
          value={students.filter((s) => s.status === "Active").length}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Total Fees Collected"
          value={`₹${(totalPaid / 1000).toFixed(0)}k`}
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Pending Tuition Dues"
          value={`₹${(totalPending / 1000).toFixed(0)}k`}
          icon={AlertCircle}
          color="amber"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-[13px]late-500">
            <Loader2 size={18} className="animate-spin text-blue-600" />
            <span>Loading students directory...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={students}
          searchKey={handleCustomSearch}
          searchPlaceholder="Search by student name, registration no (AV-STU-0001), course..."
          filterTabs={["All", "Active", "Completed", "Dropped", "Inactive"]}
          filterKey="status"
          selectable
          selectedIds={selectedStudentIds}
          onSelectionChange={setSelectedStudentIds}
          onBulkDelete={handleBulkDeletePrompt}
        />
      )}

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Bulk Delete Students?"
        message={`Are you sure you want to permanently remove the ${selectedStudentIds.length} selected student profile(s)? Their enrollments will also be removed.`}
        confirmText={`Delete (${selectedStudentIds.length}) Students`}
        type="danger"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Archive Student Profile?"
        message={`Are you sure you want to remove "${studentToDelete?.name}"? Their course enrollments will be archived.`}
        confirmText="Remove Student"
        type="danger"
      />
    </div>
  );
};

export default StudentsList;
