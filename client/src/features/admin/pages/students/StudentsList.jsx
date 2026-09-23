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
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import api from "../../../../services/api";

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
      header: "Student Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.profileImage ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            }
            alt={row.name}
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200"
          />
          <div>
            <Link
              to={`/admin/students/${row.id}`}
              className="font-bold text-slate-900 hover:text-blue-600 transition-colors block"
            >
              {row.name}
            </Link>
            <span className="text-[11px] font-mono text-slate-400">
              #{row.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact Details",
      render: (row) => (
        <div className="space-y-0.5 text-[11px]">
          <div className="flex items-center gap-1 font-mono text-slate-600">
            <Phone size={10} className="text-slate-400" />
            <span>{row.phone}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 truncate max-w-[160px]">
            <Mail size={10} className="text-slate-400 shrink-0" />
            <span className="truncate">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course & Batch",
      sortable: true,
      render: (row) => {
        const courseName = row.enrolledCourses?.[0]?.name || "Full Stack Web Development";
        const batchName = row.enrolledBatches?.[0]?.name || "Standard Track";
        return (
          <div>
            <p className="font-semibold text-slate-800">{courseName}</p>
            <p className="text-[11px] text-slate-400">{batchName}</p>
          </div>
        );
      },
    },
    {
      key: "fees",
      header: "Fee Status",
      sortable: true,
      render: (row) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-slate-900">
              ₹{(row.paidFees || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">
              / ₹{(row.totalFees || 0).toLocaleString()}
            </span>
          </div>
          <div className="mt-1">
            <StatusBadge status={row.paymentStatus || "Pending"} size="sm" />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status || "Active"} size="sm" />,
    },
    {
      key: "admissionDate",
      header: "Joined Date",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
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
            to={`/admin/students/${row.id}`}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="View Student Profile"
          >
            <Eye size={15} />
          </Link>
          <Link
            to={`/admin/students/${row.id}/edit`}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Edit Details"
          >
            <Edit size={15} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Archive Student"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

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
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 size={18} className="animate-spin text-blue-600" />
            <span>Loading students directory...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={students}
          searchKey="name"
          searchPlaceholder="Search by student name or roll number..."
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
