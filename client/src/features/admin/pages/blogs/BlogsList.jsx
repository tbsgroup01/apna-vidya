import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Newspaper,
  Calendar,
  Sparkles,
  Tag,
  BookOpen,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import api from "../../../../services/api";

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.get("/admin/blogs");
      } catch {
        res = await api.get("/public/blogs");
      }
      if (res?.data?.data?.blogs) {
        setBlogs(res.data.data.blogs);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/admin/blogs/${blogToDelete.id}`);
      setDeleteModalOpen(false);
      setBlogToDelete(null);
      await fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDeletePrompt = (ids) => {
    setSelectedBlogIds(ids);
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!selectedBlogIds.length) return;
    try {
      setBulkDeleting(true);
      const res = await api.post("/admin/blogs/bulk-delete", { ids: selectedBlogIds });
      if (res.data.success) {
        setBlogs((prev) => prev.filter((b) => !selectedBlogIds.includes(b.id)));
        setBulkDeleteModalOpen(false);
        setSelectedBlogIds([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to bulk delete blogs");
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDuplicate = async (blog) => {
    try {
      const payload = {
        title: `${blog.title} (Draft Copy)`,
        slug: `${blog.slug}-copy-${Date.now().toString().slice(-4)}`,
        category: blog.category,
        author: blog.author,
        authorRole: blog.authorRole,
        publishedDate: new Date().toISOString().split("T")[0],
        readTime: blog.readTime,
        featuredImage: blog.featuredImage,
        excerpt: blog.excerpt,
        content: blog.content,
        tags: blog.tags,
        status: "Draft",
        featured: false,
      };
      await api.post("/admin/blogs", payload);
      await fetchBlogs();
    } catch (err) {
      console.error("Failed to duplicate blog:", err);
    }
  };

  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.status === "Published").length;
    const drafts = blogs.filter((b) => b.status === "Draft").length;
    const totalReads = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
    return { total, published, drafts, totalReads };
  }, [blogs]);

  const columns = [
    {
      key: "title",
      header: "Article & Topic",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.featuredImage ||
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
            }
            alt={row.title}
            className="h-10 w-14 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
          />
          <div className="max-w-xs sm:max-w-md">
            <Link
              to={`/admin/blogs/${row.id}/edit`}
              className="font-bold text-[13px]late-900 hover:text-blue-600 transition-colors line-clamp-1"
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-2 text-[13px] text-[13px]late-400 mt-0.5">
              <span className="font-semibold text-blue-600">{row.category}</span>
              <span>•</span>
              <span className="font-mono">{(row.views || 0).toLocaleString()} Reads</span>
              {row.featured && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 font-bold">Featured</span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[13px]late-800 text-xs">{row.author}</p>
          <p className="text-[12px] text-[13px]late-400">{row.authorRole || "Mentor"}</p>
        </div>
      ),
    },
    {
      key: "publishedDate",
      header: "Publish Date",
      sortable: true,
      render: (row) => (
        <span className="text-[13px]late-500 font-mono text-[13px]">
          {row.publishedDate}
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
          <Link
            to={`/blog/${row.slug}`}
            target="_blank"
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Preview Live Article"
          >
            <Eye size={15} />
          </Link>
          <Link
            to={`/admin/blogs/${row.id}/edit`}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-slate-100 hover:text-[13px]late-700 transition-colors"
            title="Edit Article"
          >
            <Edit size={15} />
          </Link>
          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Duplicate Draft"
          >
            <Copy size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Article"
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
        title="Blog Editorial Hub"
        description="Publish educational guides, technical articles, roadmaps, and manage real-time blog content."
        breadcrumbs={[{ label: "Blogs" }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/blog-categories"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
            >
              <Tag size={15} />
              <span>Categories</span>
            </Link>
            <Link
              to="/admin/blogs/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Write Blog</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Articles"
          value={stats.total.toString()}
          change="Catalog Count"
          isPositive={true}
          comparison="Stored in Database"
          icon="Newspaper"
          color="blue"
        />
        <StatCard
          title="Published Live"
          value={stats.published.toString()}
          change="Publicly Accessible"
          isPositive={true}
          comparison="Live on Website"
          icon="BookOpen"
          color="emerald"
        />
        <StatCard
          title="Draft Articles"
          value={stats.drafts.toString()}
          change="In Editorial Review"
          isPositive={true}
          comparison="Internal Pipeline"
          icon="Edit"
          color="amber"
        />
        <StatCard
          title="Total Reads"
          value={stats.totalReads.toLocaleString()}
          change="Student Engagements"
          isPositive={true}
          comparison="Real-Time Impressions"
          icon="Sparkles"
          color="purple"
        />
      </div>

      <DataTable
        columns={columns}
        data={blogs}
        searchKey="title"
        searchPlaceholder="Search blogs by title..."
        filterTabs={["All", "Published", "Draft", "Archived"]}
        filterKey="status"
        loading={loading}
        selectable
        selectedIds={selectedBlogIds}
        onSelectionChange={setSelectedBlogIds}
        onBulkDelete={handleBulkDeletePrompt}
      />

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Bulk Delete Blogs?"
        message={`Are you sure you want to permanently delete the ${selectedBlogIds.length} selected blog article(s)? This action cannot be undone.`}
        confirmText={bulkDeleting ? "Deleting..." : `Delete (${selectedBlogIds.length}) Articles`}
        type="danger"
        loading={bulkDeleting}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Blog Post?"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This article will be unpublished and permanently deleted.`}
        confirmText="Delete Article"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default BlogsList;
