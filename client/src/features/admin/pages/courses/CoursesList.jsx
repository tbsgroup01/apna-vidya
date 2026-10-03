import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  BookOpen,
  Clock,
  GraduationCap,
  Users,
  IndianRupee,
  Layers,
  Sparkles,
  Tags,
  Loader2,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import api from "../../../../services/api";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/courses?limit=100");
      if (res.data.success) {
        setCourses(res.data.data.courses || []);
      }
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const activeCount = courses.filter((c) => c.status === "Active").length;
  const draftCount = courses.filter((c) => c.status === "Draft").length;

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await api.delete(`/admin/courses/${courseToDelete.id}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
      setDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course program");
    }
  };

  const handleBulkDeletePrompt = (ids) => {
    setSelectedCourseIds(ids);
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!selectedCourseIds.length) return;
    try {
      const res = await api.post("/admin/courses/bulk-delete", { ids: selectedCourseIds });
      if (res.data.success) {
        setCourses((prev) => prev.filter((c) => !selectedCourseIds.includes(c.id)));
        setBulkDeleteModalOpen(false);
        setSelectedCourseIds([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to bulk delete courses");
    }
  };

  const handleDuplicate = async (course) => {
    try {
      const res = await api.post("/admin/courses", {
        name: `${course.name} (Copy)`,
        description: course.description,
        image: course.image,
        duration: course.duration,
        level: course.level,
        fees: course.fees,
        categoryId: course.categoryId,
        status: "Draft",
      });
      if (res.data.success) {
        fetchCourses();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to duplicate course");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Course Program",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.image ||
              "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=120&q=80"
            }
            alt={row.name}
            className="h-10 w-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <Link
              to={`/admin/courses/${row.id}`}
              className="font-bold text-[13px]late-900 hover:text-blue-600 transition-colors block truncate max-w-xs"
            >
              {row.name}
            </Link>
            <div className="flex items-center gap-2 text-[13px] text-[13px]late-400 mt-0.5">
              <span>{row.category?.name || "General"}</span>
              <span>•</span>
              <span className="font-mono">{row.duration || "6 Months"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "fees",
      header: "Program Fee",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-[13px]late-900">
          ₹{(row.fees || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "modules",
      header: "Modules",
      render: (row) => (
        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
          {row.modules?.length || 0} Modules
        </span>
      ),
    },
    {
      key: "batches",
      header: "Batches",
      render: (row) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-[13px]late-700">
          {row.batches?.length || 0} Active
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status || "Active"} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/admin/courses/${row.id}`}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Manage Curriculum & Batches"
          >
            <Eye size={15} />
          </Link>
          <Link
            to={`/admin/courses/${row.id}/edit`}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-slate-100 hover:text-[13px]late-700 transition-colors"
            title="Edit Program Details"
          >
            <Edit size={15} />
          </Link>
          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Duplicate Program"
          >
            <Copy size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Course"
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
        title="Course Programs"
        description="Design curriculum, manage academic subjects, syllabi, fee tiers, and learning cohorts."
        breadcrumbs={[{ label: "Courses" }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/courses/categories"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
            >
              <Tags size={15} />
              <span>Categories</span>
            </Link>
            <Link
              to="/admin/courses/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Program</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Published Programs"
          value={activeCount}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Draft / Under Review"
          value={draftCount}
          icon={Layers}
          color="amber"
        />
        <StatCard
          title="Total Programs"
          value={courses.length}
          icon={Sparkles}
          color="purple"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-[13px]late-500">
            <Loader2 size={18} className="animate-spin text-blue-600" />
            <span>Loading courses from catalog...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={courses}
          searchKey="name"
          searchPlaceholder="Search courses by name or subject..."
          filterTabs={["All", "Active", "Draft", "Archived"]}
          filterKey="status"
          selectable
          selectedIds={selectedCourseIds}
          onSelectionChange={setSelectedCourseIds}
          onBulkDelete={handleBulkDeletePrompt}
        />
      )}

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Bulk Delete Course Programs?"
        message={`Are you sure you want to permanently delete the ${selectedCourseIds.length} selected course program(s)? All associated modules and lessons will also be removed.`}
        confirmText={`Delete (${selectedCourseIds.length}) Courses`}
        type="danger"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Course Program?"
        message={`Are you sure you want to delete "${courseToDelete?.name}"? All associated modules and lessons will also be removed.`}
        confirmText="Delete Program"
        type="danger"
      />
    </div>
  );
};

export default CoursesList;
