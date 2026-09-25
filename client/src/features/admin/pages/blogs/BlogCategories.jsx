import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, ArrowLeft, Tags } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import { initialBlogCategories } from "../../../../data/admin/blogsAdminData";

const BlogCategories = () => {
  const [categories, setCategories] = useState(initialBlogCategories);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleDelete = (cat) => {
    setCatToDelete(cat);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (catToDelete) {
      setCategories(categories.filter((c) => c.id !== catToDelete.id));
      setCatToDelete(null);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newCat = {
      id: `CAT-${categories.length + 1}`,
      name: form.name,
      slug:
        form.slug ||
        form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: form.description,
      postCount: 0,
      status: "Active",
    };
    setCategories([...categories, newCat]);
    setAddModalOpen(false);
    setForm({ name: "", slug: "", description: "" });
  };

  const columns = [
    {
      key: "name",
      header: "Category Name",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-[13px]late-900">{row.name}</span>
          <p className="text-[13px] font-mono text-[13px]late-400">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="text-xs text-[13px]late-600 line-clamp-1">
          {row.description}
        </span>
      ),
    },
    {
      key: "postCount",
      header: "Articles",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 text-xs">
          {row.postCount} Posts
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
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
        title="Blog Categories"
        description="Organize articles and tutorials by technology stacks and career topics."
        breadcrumbs={[
          { label: "Blogs", path: "/admin/blogs" },
          { label: "Categories" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50"
            >
              <ArrowLeft size={15} />
              <span>Back to Blogs</span>
            </Link>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>New Category</span>
            </button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Search categories..."
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete category "${catToDelete?.name}"?`}
        confirmText="Delete"
        type="danger"
      />

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[13px]late-900">
              Create Blog Category
            </h3>
            <p className="mt-1 text-xs text-[13px]late-500">
              Add a new category to group related tutorials.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cloud Computing"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="cloud-computing"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Topics covered in this category..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCategories;
