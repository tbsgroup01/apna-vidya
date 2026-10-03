import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Newspaper,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import RichTextEditor from "../../components/RichTextEditor";
import { ImageUploadPreview } from "../../components/FormControls";
import api from "../../../../services/api";

const PRESET_COVERS = [
  {
    label: "Web Dev Coding",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Tech Interview / Team",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Data Science & AI",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Modern Workspace",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
];

const CATEGORY_OPTIONS = [
  "Technology",
  "Career Guide",
  "Artificial Intelligence",
  "Web Development",
  "Placement Tips",
  "Cloud & DevOps",
  "General",
];

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Technology",
    author: "ApnaVidya Editorial",
    authorRole: "Senior Mentor",
    publishedDate: new Date().toISOString().split("T")[0],
    readTime: "5 min read",
    status: "Published",
    featured: false,
    tags: "Tech, Programming, Career",
    featuredImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    excerpt: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/admin/blogs/${id}`);
          if (res.data?.data?.blog) {
            const b = res.data.data.blog;
            setFormData({
              title: b.title || "",
              slug: b.slug || "",
              category: b.category || "Technology",
              author: b.author || "ApnaVidya Editorial",
              authorRole: b.authorRole || "Senior Mentor",
              publishedDate: b.publishedDate || new Date().toISOString().split("T")[0],
              readTime: b.readTime || "5 min read",
              status: b.status || "Published",
              featured: Boolean(b.featured),
              tags: b.tags || "",
              featuredImage: b.featuredImage || "",
              excerpt: b.excerpt || "",
              content: b.content || "",
              seoTitle: b.seoTitle || "",
              seoDescription: b.seoDescription || "",
            });
          }
        } catch (err) {
          setError("Failed to load blog post for editing.");
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  const handleChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (field === "title" && !isEdit) {
        next.slug = slugify(val);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Article title is required.");
      return;
    }
    if (!formData.content || formData.content === "<p></p>" || !formData.content.trim()) {
      setError("Article body content cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (isEdit) {
        await api.put(`/admin/blogs/${id}`, formData);
      } else {
        await api.post("/admin/blogs", formData);
      }

      navigate("/admin/blogs");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save article. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="animate-spin inline-block h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-xs font-semibold text-[13px]late-500">Loading article editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title={isEdit ? "Edit Blog Article" : "Compose New Blog"}
        description="Draft and publish technical roadmaps, educational insights, and placement advice with rich formatted typography."
        breadcrumbs={[
          { label: "Blogs", path: "/admin/blogs" },
          { label: isEdit ? "Edit Article" : "Create Article" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Cancel</span>
            </Link>
            {formData.slug && (
              <Link
                to={`/blog/${formData.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
              >
                <Eye size={15} />
                <span>Preview</span>
              </Link>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
            >
              <Save size={15} />
              <span>{submitting ? "Publishing..." : isEdit ? "Update Article" : "Publish Article"}</span>
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center gap-2.5">
            <AlertCircle size={17} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 text-[13px]late-900 font-bold text-[13px]m">
            <Newspaper size={18} className="text-blue-600" />
            <span>Article Metadata & Overview</span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Top 10 Full-Stack Web Development Trends in 2026"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => handleChange("slug", slugify(e.target.value))}
                placeholder="e.g. top-10-web-dev-trends-2026"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 focus:border-blue-500 focus:outline-hidden cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="e.g. Dr. Vikramaditya Sen"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Author Designation / Role
              </label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => handleChange("authorRole", e.target.value)}
                placeholder="e.g. Chief Academic Officer"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => handleChange("readTime", e.target.value)}
                placeholder="e.g. 5 min read"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 focus:border-blue-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Published">Published (Live on Website)</option>
                <option value="Draft">Draft (Internal)</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Article Excerpt / Summary
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                placeholder="A compelling 1-2 sentence preview to engage readers in the blog listing cards..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange("featured", e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-[13px]late-700 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" />
                  Spotlight as Featured Lead Article
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 text-[13px]late-900 font-bold text-[13px]m">
            <ImageIcon size={18} className="text-emerald-600" />
            <span>Featured Cover Image</span>
          </div>

          <ImageUploadPreview
            label="Article Banner Image"
            value={formData.featuredImage}
            onChange={(url) => handleChange("featuredImage", url)}
            aspect="video"
            presets={PRESET_COVERS}
            helperText="Upload an image file directly from your computer or select a preset / paste image URL"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <RichTextEditor
            label="Article Body Content (Rich Text Editor)"
            required={true}
            value={formData.content}
            onChange={(html) => handleChange("content", html)}
            minHeight="380px"
            placeholder="Write formatted article content here with headings, bullet points, blockquotes, code blocks, links, and styling..."
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[13px]late-700">
              Search Engine Optimization (SEO)
            </h3>
            <p className="text-[13px] text-[13px]late-400">
              Customize title tags and meta descriptions for search engines
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => handleChange("seoTitle", e.target.value)}
                placeholder="e.g. Top 10 Web Development Trends in 2026 | ApnaVidya"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="e.g. React, Next.js, Career, WebDev"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[13px]late-700">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => handleChange("seoDescription", e.target.value)}
                placeholder="Concise summary for search engine snippets (150-160 characters)..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/blogs"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-[13px]late-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all cursor-pointer"
          >
            <Save size={15} />
            <span>{submitting ? "Publishing..." : isEdit ? "Update Article" : "Publish Article"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
