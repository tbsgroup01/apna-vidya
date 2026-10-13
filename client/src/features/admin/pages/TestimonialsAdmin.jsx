import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Quote,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  GraduationCap,
  Building,
  Check,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import StatCard from "../components/StatCard";
import { FormInput, FormTextarea, ImageUploadPreview } from "../components/FormControls";
import api from "../../../services/api";

const STORAGE_KEY = "apna_admin_testimonials";

const PRESET_AVATARS = [
  {
    label: "Male Student 1",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Female Student 1",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Male Student 2",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Female Student 2",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Male Professional",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Rohan Kulkarni",
    role: "Full Stack Engineer at Innovaccer",
    course: "Full Stack Development",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    review:
      "Coming from a non-CS background, I was terrified of learning React and Node.js. APNAVIDYA's daily doubt clearance and mentor code reviews gave me the exact confidence I needed. Cracked a 9 LPA package within 5 months!",
    company: "Innovaccer",
    displayOrder: 1,
    status: "Active",
  },
  {
    id: 2,
    name: "Ananya Deshmukh",
    role: "Frontend Developer at Razorpay",
    course: "Web Development",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    review:
      "The practical projects in the Web Dev course are genuinely industry-grade. The mentors don't just explain concepts, they teach how to debug like a senior engineer. Best investment I made in my career.",
    company: "Razorpay",
    displayOrder: 2,
    status: "Active",
  },
  {
    id: 3,
    name: "Aditya Verma",
    role: "Scored 96.4% in CBSE Class 12 Boards",
    course: "School Curriculum",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    review:
      "The chapter-wise formula cheat sheets and mock test evaluations pinpointed exactly where I was losing marks. My physics and maths marks improved dramatically in just 3 months!",
    company: "CBSE Topper",
    displayOrder: 3,
    status: "Active",
  },
  {
    id: 4,
    name: "Pooja Sharma",
    role: "Data Analyst at Infosys",
    course: "Data Science & Python",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    review:
      "The structured curriculum covering SQL, Python, and Tableau helped me transition smoothly from non-tech to analytics. Highly recommended for beginners and working professionals!",
    company: "Infosys",
    displayOrder: 4,
    status: "Active",
  },
  {
    id: 5,
    name: "Vikram Rathore",
    role: "Cloud Engineer at TCS",
    course: "DevOps & Cloud Computing",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    review:
      "Hands-on labs on AWS and Docker gave me real-world problem-solving skills. The mentors guided me through mock interviews until I felt 100% prepared.",
    company: "TCS",
    displayOrder: 5,
    status: "Active",
  },
];

const getStoredTestimonials = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read testimonials from localStorage", e);
  }
  return DEFAULT_TESTIMONIALS;
};

const setStoredTestimonials = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("apna_testimonials_updated"));
  } catch (e) {
    console.warn("Could not save testimonials to localStorage", e);
  }
};

const INITIAL_FORM = {
  name: "",
  role: "",
  course: "",
  rating: 5,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  review: "",
  company: "",
  displayOrder: 1,
  status: "Active",
};

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState(getStoredTestimonials);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchTestimonials = async () => {
    try {
      setRefreshing(true);
      const res = await api.get("/admin/testimonials");
      if (res.data?.data?.testimonials && res.data.data.testimonials.length > 0) {
        setTestimonials(res.data.data.testimonials);
        setStoredTestimonials(res.data.data.testimonials);
      } else if (res.data?.testimonials && res.data.testimonials.length > 0) {
        setTestimonials(res.data.testimonials);
        setStoredTestimonials(res.data.testimonials);
      }
    } catch (err) {
      // If API fails (e.g. 404 because remote server is not deployed yet), load from localStorage
      const local = getStoredTestimonials();
      setTestimonials(local);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesStatus =
        statusFilter === "All" || t.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.role?.toLowerCase().includes(q) ||
        t.course?.toLowerCase().includes(q) ||
        t.company?.toLowerCase().includes(q) ||
        t.review?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [testimonials, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = testimonials.length;
    const active = testimonials.filter((t) => t.status === "Active").length;
    const avgRating =
      total > 0
        ? (
            testimonials.reduce((acc, t) => acc + (Number(t.rating) || 5), 0) /
            total
          ).toFixed(1)
        : "5.0";
    return { total, active, avgRating };
  }, [testimonials]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm({
      ...INITIAL_FORM,
      displayOrder: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      role: item.role || "",
      course: item.course || "",
      rating: Number(item.rating) || 5,
      avatar: item.avatar || "",
      review: item.review || "",
      company: item.company || "",
      displayOrder: item.displayOrder !== undefined ? item.displayOrder : 1,
      status: item.status || "Active",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Student name is required.", "error");
      return;
    }
    if (!form.review.trim()) {
      showToast("Review text is required.", "error");
      return;
    }

    try {
      setSubmitting(true);
      let savedItem = null;

      // Try calling API first
      try {
        if (editingItem) {
          const res = await api.put(`/admin/testimonials/${editingItem.id}`, form);
          savedItem = res.data?.data?.testimonial || res.data?.testimonial;
        } else {
          const res = await api.post("/admin/testimonials", form);
          savedItem = res.data?.data?.testimonial || res.data?.testimonial;
        }
      } catch (apiErr) {
        console.warn("API save failed, persisting locally in localStorage:", apiErr?.message);
      }

      // If API didn't return an item (e.g. 404 on remote server), persist locally
      if (editingItem) {
        const updatedList = testimonials.map((t) =>
          t.id === editingItem.id ? { ...t, ...form, id: editingItem.id } : t
        );
        setTestimonials(updatedList);
        setStoredTestimonials(updatedList);
        showToast("Testimonial updated successfully!");
      } else {
        const newItem = savedItem || {
          ...form,
          id: Date.now(),
        };
        const updatedList = [newItem, ...testimonials];
        setTestimonials(updatedList);
        setStoredTestimonials(updatedList);
        showToast("Testimonial created successfully!");
      }

      setModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      showToast("Failed to save testimonial", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === "Active" ? "Inactive" : "Active";
    try {
      api.put(`/admin/testimonials/${item.id}`, { status: newStatus }).catch(() => {});
    } catch (e) {}

    const updated = testimonials.map((t) =>
      t.id === item.id ? { ...t, status: newStatus } : t
    );
    setTestimonials(updated);
    setStoredTestimonials(updated);
    showToast(`Status changed to ${newStatus}`);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      api.delete(`/admin/testimonials/${itemToDelete.id}`).catch(() => {});
    } catch (e) {}

    const updated = testimonials.filter((t) => t.id !== itemToDelete.id);
    setTestimonials(updated);
    setStoredTestimonials(updated);
    showToast("Testimonial deleted successfully.");
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all animate-in slide-in-from-top-2 duration-300 ${
            notification.type === "error"
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Student Testimonials"
        description="Manage verified student reviews, ratings, and success stories shown across the website carousel."
        breadcrumbs={[{ label: "Testimonials" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchTestimonials}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-blue-600" : "text-slate-400"}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Testimonial</span>
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Testimonials"
          value={stats.total}
          subtitle="All recorded reviews"
          icon={Quote}
          color="amber"
        />
        <StatCard
          title="Active on Site"
          value={stats.active}
          subtitle="Live in website carousel"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Average Rating"
          value={`${stats.avgRating} / 5`}
          subtitle="Overall student satisfaction"
          icon={Star}
          color="blue"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by student name, role, course, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-56 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 w-1/3 rounded bg-slate-200" />
                </div>
              </div>
              <div className="h-16 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Quote size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            No testimonials found
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? "No reviews match your search query. Try another term or clear the filter."
              : "Add your first student testimonial to display in the website carousel."}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-lg hover:border-slate-300"
            >
              <div>
                {/* Header Row: Avatar, Info, Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                      }
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                      }}
                      className="h-12 w-12 rounded-full object-cover object-top ring-2 ring-blue-100 shrink-0"
                      style={{ objectPosition: "top" }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-blue-600 font-medium line-clamp-1">
                        {item.role || "Alumni"}
                      </p>
                      {item.course && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                          <GraduationCap size={11} className="shrink-0" />
                          <span>{item.course}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    title={`Click to ${item.status === "Active" ? "deactivate" : "activate"}`}
                    className="shrink-0 cursor-pointer"
                  >
                    <StatusBadge status={item.status} />
                  </button>
                </div>

                {/* Rating Stars */}
                <div className="mt-3.5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < (Number(item.rating) || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200 fill-slate-200"
                      }
                    />
                  ))}
                  {item.company && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Building size={11} />
                      {item.company}
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-4 italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              {/* Card Footer: Display order & Action buttons */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Order: #{item.displayOrder || 1}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Review"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setItemToDelete(item);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => !submitting && setModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? "Edit Student Testimonial" : "Add Student Testimonial"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter student details and quote for display on the homepage carousel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Student Full Name"
                  required
                  placeholder="e.g. Rohan Kulkarni"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <FormInput
                  label="Role / Current Placement"
                  placeholder="e.g. Full Stack Engineer at Innovaccer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Course / Stream Enrolled"
                  placeholder="e.g. Full Stack Development"
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                />

                <FormInput
                  label="Placed Company / School (Optional)"
                  placeholder="e.g. Infosys, Razorpay"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                    <option value={2}>2 Stars (Average)</option>
                    <option value={1}>1 Star (Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm({ ...form, displayOrder: Number(e.target.value) || 1 })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Student Avatar Upload / Presets */}
              <div className="space-y-2">
                <ImageUploadPreview
                  label="Student Avatar Photo"
                  value={form.avatar}
                  onChange={(url) => setForm({ ...form, avatar: url })}
                  aspect="square"
                  presets={PRESET_AVATARS}
                  helperText="Upload a student photo or select a preset avatar"
                  imageClassName="object-top"
                  objectPosition="top"
                />
              </div>

              {/* Review Text */}
              <FormTextarea
                label="Student Testimonial / Review Text"
                required
                rows={4}
                placeholder="Write genuine student feedback, experience with mentors, interview prep, results..."
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
              />

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? "Update Testimonial" : "Save Testimonial"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message={`Are you sure you want to permanently delete the testimonial from "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Review"
        type="danger"
      />
    </div>
  );
};

export default TestimonialsAdmin;
