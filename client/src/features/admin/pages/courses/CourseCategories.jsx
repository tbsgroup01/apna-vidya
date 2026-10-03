import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Tags,
  Layers,
  CheckCircle2,
  Code,
  Brain,
  Smartphone,
  Binary,
  Cloud,
  Shield,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "../../components/FormControls";
import api from "../../../../services/api";

const iconMap = {
  Code,
  Brain,
  Smartphone,
  Binary,
  Cloud,
  Shield,
};

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  amber: "bg-amber-50 text-amber-600 border-amber-200",
  sky: "bg-sky-50 text-[13px]ky-600 border-sky-200",
  rose: "bg-rose-50 text-rose-600 border-rose-200",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
};

const CourseCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    color: "blue",
    iconName: "Code",
    displayOrder: 1,
    status: "Active",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/courses/categories/all");
      if (res.data?.data?.categories) {
        const mapped = res.data.data.categories.map((c) => ({
          ...c,
          coursesCount: c.courses?.length || 0,
          color: c.color || "blue",
          iconName: c.iconName || "Code",
          status: c.status || "Active",
        }));
        setCategories(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      color: "blue",
      iconName: "Code",
      displayOrder: categories.length + 1,
      status: "Active",
    });
    setFormModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      color: cat.color || "blue",
      iconName: cat.iconName || "Code",
      displayOrder: cat.displayOrder || 1,
      status: cat.status || "Active",
    });
    setFormModalOpen(true);
  };

  const handleNameChange = (val) => {
    setForm((prev) => {
      const updated = { ...prev, name: val };
      if (!editingCategory) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/courses/categories/${editingCategory.id}`, form);
      } else {
        await api.post("/admin/courses/categories", form);
      }
      setFormModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await api.delete(`/admin/courses/categories/${categoryToDelete.id}`);
        setCategoryToDelete(null);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete category");
      }
    }
  };

  const totalCourses = categories.reduce((sum, c) => sum + (c.coursesCount || 0), 0);
  const activeCount = categories.filter((c) => c.status === "Active").length;
  const topCategoryName = categories.length > 0
    ? [...categories].sort((a, b) => (b.coursesCount || 0) - (a.coursesCount || 0))[0]?.name
    : "None";

  const columns = [
    {
      key: "name",
      header: "Category",
      sortable: true,
      render: (row) => {
        const IconComponent = iconMap[row.iconName] || Code;
        const colorClass = colorClasses[row.color] || colorClasses.blue;
        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center ${colorClass}`}
            >
              <IconComponent size={18} />
            </div>
            <div>
              <span className="font-bold text-[13px]late-900">{row.name}</span>
              <p className="text-[13px] font-mono text-[13px]late-400">/{row.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="text-xs text-[13px]late-600 line-clamp-1 max-w-sm">
          {row.description || "No description provided"}
        </span>
      ),
    },
    {
      key: "coursesCount",
      header: "Courses",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {row.coursesCount} Programs
        </span>
      ),
    },
    {
      key: "displayOrder",
      header: "Order",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-[13px]late-500">
          #{row.displayOrder || 1}
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
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-slate-100 hover:text-[13px]late-800 transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Category"
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
        title="Course Categories"
        description="Organize academic disciplines, programs, and tracks across the student portal."
        breadcrumbs={[
          { label: "Courses", href: "/admin/courses" },
          { label: "Categories" },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/courses"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>Back to Courses</span>
            </Link>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Category</span>
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Categories"
          value={categories.length}
          icon={Tags}
          trend={0}
          trendLabel="Catalog groups"
          color="blue"
        />
        <StatCard
          title="Active Tracks"
          value={activeCount}
          icon={CheckCircle2}
          trend={12}
          trendLabel="Live on portal"
          color="emerald"
        />
        <StatCard
          title="Total Programs"
          value={totalCourses}
          icon={Layers}
          trend={18}
          trendLabel="Across all categories"
          color="purple"
        />
        <StatCard
          title="Top Category"
          value={topCategoryName}
          icon={Code}
          trend={25}
          trendLabel="Highest student demand"
          color="amber"
        />
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Search categories by name..."
        filterTabs={["All", "Active", "Draft"]}
        loading={loading}
      />

      {formModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Tags size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[13px]late-900">
                    {editingCategory ? "Edit Course Category" : "Create Course Category"}
                  </h3>
                  <p className="text-xs text-[13px]late-500">
                    {editingCategory
                      ? `Updating details for ${editingCategory.name}`
                      : "Add a new discipline to group educational courses."}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <FormInput
                label="Category Name"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Artificial Intelligence & ML"
              />

              <FormInput
                label="URL Slug"
                required
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="e.g. artificial-intelligence-ml"
              />

              <FormTextarea
                label="Description"
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief summary of curriculum covered under this category..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Color Palette"
                  value={form.color}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, color: e.target.value }))
                  }
                  options={[
                    { label: "Blue", value: "blue" },
                    { label: "Purple", value: "purple" },
                    { label: "Emerald", value: "emerald" },
                    { label: "Amber", value: "amber" },
                    { label: "Sky", value: "sky" },
                    { label: "Rose", value: "rose" },
                    { label: "Indigo", value: "indigo" },
                  ]}
                />

                <FormSelect
                  label="Icon"
                  value={form.iconName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, iconName: e.target.value }))
                  }
                  options={[
                    { label: "Code (Programming)", value: "Code" },
                    { label: "Brain (AI & ML)", value: "Brain" },
                    { label: "Smartphone (Mobile)", value: "Smartphone" },
                    { label: "Binary (DSA & CS)", value: "Binary" },
                    { label: "Cloud (DevOps)", value: "Cloud" },
                    { label: "Shield (Security)", value: "Shield" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Display Order"
                  type="number"
                  min="1"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      displayOrder: e.target.value,
                    }))
                  }
                />

                <FormSelect
                  label="Status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  options={["Active", "Draft", "Inactive"]}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete "${categoryToDelete?.name}" Category`}
        message="Are you sure you want to delete this course category? Courses mapped to this category may need to be reassigned."
        confirmText="Yes, Delete Category"
        variant="danger"
      />
    </div>
  );
};

export default CourseCategories;
