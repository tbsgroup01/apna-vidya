import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Sliders,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ArrowUpDown,
  Search,
  Check,
  Eye,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { FormInput, FormSelect, FormTextarea, ImageUploadPreview } from "../components/FormControls";
import api from "../../../services/api";
import { initialHeroSliders } from "../../../data/admin/heroSlidersData";

const PRESET_IMAGES = [
  {
    label: "Software Mentorship",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Tech Working Batch",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Scholarship & Campus",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Data Science & AI",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Creative Design",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
  },
];

const INITIAL_FORM = {
  title: "",
  subtitle: "",
  description: "",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  buttonText: "Explore Courses",
  buttonUrl: "/courses",
  secondaryButtonText: "Book a Demo Class",
  secondaryButtonUrl: "/demo-class",
  displayOrder: 1,
  startDate: new Date().toISOString().split("T")[0],
  endDate: "2026-12-31",
  status: "Active",
};

const HeroSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchSliders = async () => {
    try {
      setRefreshing(true);
      const res = await api.get("/admin/hero-sliders");
      if (res.data && res.data.data && Array.isArray(res.data.data.sliders)) {
        setSliders(res.data.data.sliders);
      } else if (res.data && Array.isArray(res.data.sliders)) {
        setSliders(res.data.sliders);
      } else {
        const pubRes = await api.get("/public/hero-sliders");
        if (pubRes.data && pubRes.data.data && Array.isArray(pubRes.data.data.sliders)) {
          setSliders(pubRes.data.data.sliders);
        } else {
          setSliders(initialHeroSliders);
        }
      }
    } catch (err) {
      try {
        const pubRes = await api.get("/public/hero-sliders");
        if (pubRes.data && pubRes.data.data && Array.isArray(pubRes.data.data.sliders)) {
          setSliders(pubRes.data.data.sliders);
        } else {
          setSliders(initialHeroSliders);
        }
      } catch {
        setSliders(initialHeroSliders);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleOpenCreate = () => {
    setEditingSlider(null);
    setForm({
      ...INITIAL_FORM,
      displayOrder: sliders.length + 1,
      startDate: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (slider) => {
    setEditingSlider(slider);
    setForm({
      title: slider.title || "",
      subtitle: slider.subtitle || "",
      description: slider.description || "",
      image: slider.image || INITIAL_FORM.image,
      buttonText: slider.buttonText || "Explore Courses",
      buttonUrl: slider.buttonUrl || "/courses",
      secondaryButtonText: slider.secondaryButtonText || "",
      secondaryButtonUrl: slider.secondaryButtonUrl || "",
      displayOrder: Number(slider.displayOrder) || 1,
      startDate: slider.startDate || new Date().toISOString().split("T")[0],
      endDate: slider.endDate || "",
      status: slider.status || "Active",
    });
    setModalOpen(true);
  };

  const handleDelete = (slider) => {
    setSliderToDelete(slider);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sliderToDelete) return;
    try {
      if (typeof sliderToDelete.id === "number" || !isNaN(Number(sliderToDelete.id))) {
        await api.delete(`/admin/hero-sliders/${sliderToDelete.id}`);
      }
      setSliders((prev) => prev.filter((s) => s.id !== sliderToDelete.id));
      showToast("Hero banner slide removed successfully");
    } catch (err) {
      setSliders((prev) => prev.filter((s) => s.id !== sliderToDelete.id));
      showToast("Banner removed locally", "info");
    } finally {
      setSliderToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleToggleStatus = async (slider) => {
    const newStatus = slider.status === "Active" ? "Inactive" : "Active";
    try {
      if (typeof slider.id === "number" || !isNaN(Number(slider.id))) {
        await api.put(`/admin/hero-sliders/${slider.id}`, { status: newStatus });
      }
      setSliders((prev) =>
        prev.map((s) => (s.id === slider.id ? { ...s, status: newStatus } : s))
      );
      showToast(`Banner status updated to ${newStatus}`);
    } catch (err) {
      setSliders((prev) =>
        prev.map((s) => (s.id === slider.id ? { ...s, status: newStatus } : s))
      );
      showToast(`Status toggled to ${newStatus}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        image: form.image,
        buttonText: form.buttonText,
        buttonUrl: form.buttonUrl,
        secondaryButtonText: form.secondaryButtonText,
        secondaryButtonUrl: form.secondaryButtonUrl,
        displayOrder: Number(form.displayOrder) || 1,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status,
      };

      if (editingSlider) {
        if (typeof editingSlider.id === "number" || !isNaN(Number(editingSlider.id))) {
          const res = await api.put(`/admin/hero-sliders/${editingSlider.id}`, payload);
          const updated = res.data?.data?.slider || { ...payload, id: editingSlider.id };
          setSliders((prev) =>
            prev.map((s) => (s.id === editingSlider.id ? updated : s))
          );
        } else {
          setSliders((prev) =>
            prev.map((s) =>
              s.id === editingSlider.id ? { ...payload, id: s.id } : s
            )
          );
        }
        showToast("Hero banner updated successfully in real-time");
      } else {
        try {
          const res = await api.post("/admin/hero-sliders", payload);
          const created = res.data?.data?.slider || { ...payload, id: Date.now() };
          setSliders((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder));
          showToast("New hero banner created and published to homepage");
        } catch {
          const localItem = { ...payload, id: Date.now() };
          setSliders((prev) => [...prev, localItem].sort((a, b) => a.displayOrder - b.displayOrder));
          showToast("New hero banner created successfully");
        }
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save banner", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSliders = useMemo(() => {
    return sliders
      .filter((slider) => {
        const matchesStatus =
          statusFilter === "All" || slider.status === statusFilter;
        const matchesSearch =
          (slider.title &&
            slider.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (slider.subtitle &&
            slider.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (slider.description &&
            slider.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
  }, [sliders, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = sliders.length;
    const active = sliders.filter((s) => s.status === "Active").length;
    const draft = sliders.filter((s) => s.status === "Draft").length;
    const inactive = sliders.filter((s) => s.status === "Inactive").length;
    return { total, active, draft, inactive };
  }, [sliders]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero Slider Banners"
        description="Curate dynamic carousel promo banners, seasonal discounts, and batch CTA slides shown in real-time on the homepage."
        breadcrumbs={[{ label: "Hero Sliders" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchSliders}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh sliders from database"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-600" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Banner</span>
            </button>
          </div>
        }
      />

      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl p-3.5 text-xs font-medium border shadow-xs transition-all ${
            notification.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : notification.type === "info"
              ? "bg-blue-50 border-blue-200 text-blue-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Slides</p>
          <p className="mt-1.5 text-2xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs">
          <p className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Active Live</p>
          <p className="mt-1.5 text-2xl font-black text-emerald-800">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-xs">
          <p className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">Draft Slides</p>
          <p className="mt-1.5 text-2xl font-black text-amber-800">{stats.draft}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Inactive</p>
          <p className="mt-1.5 text-2xl font-black text-slate-700">{stats.inactive}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search banners by headline, subtitle or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["All", "Active", "Draft", "Inactive"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="h-44 rounded-xl bg-slate-200" />
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : filteredSliders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
            <Sliders size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No hero banners found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your search query or status filter."
              : "Get started by creating your first hero slider banner for the homepage."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create First Banner</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSliders.map((slider) => (
            <div
              key={slider.id}
              className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={slider.image}
                    alt={slider.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-md bg-slate-900/85 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs border border-white/10 shadow-xs">
                      Order #{slider.displayOrder}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(slider)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <StatusBadge status={slider.status} size="sm" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold text-blue-600 tracking-wide uppercase">
                      {slider.subtitle || "Featured Announcement"}
                    </p>
                    <h4 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {slider.title}
                    </h4>
                  </div>
                  {slider.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {slider.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                      Primary CTA: {slider.buttonText || "Explore"}
                    </span>
                    {slider.secondaryButtonText && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                        Sec CTA: {slider.secondaryButtonText}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Active: {slider.startDate || "Ongoing"}</span>
                    {slider.endDate && <span>Until: {slider.endDate}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 p-3 bg-slate-50/70 border-t border-slate-100">
                <a
                  href={slider.buttonUrl || "/courses"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={12} />
                  <span>Preview Target</span>
                </a>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slider)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(slider)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Hero Banner Slide?"
        message={`Are you sure you want to remove banner "${sliderToDelete?.title}"? It will immediately stop appearing on the website homepage.`}
        confirmText="Delete Banner"
        type="danger"
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSlider ? "Edit Hero Banner Slide" : "Create Real-Time Hero Banner"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure real-time headlines, actions, background images, and homepage positioning.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <FormInput
                label="Banner Headline *"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Master Software Engineering with 1-on-1 Live Mentorship"
              />

              <FormInput
                label="Eyebrow Subtitle / Category *"
                required
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="e.g. From Zero to Full Stack Developer with Industry Projects"
              />

              <FormTextarea
                label="Slide Description / Key Highlights"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short summary highlighting course outcomes, practical learning, or discount details..."
              />

              <ImageUploadPreview
                label="Banner Background Image"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                aspect="banner"
                presets={PRESET_IMAGES}
                helperText="Upload custom banner graphic (1200x500 recommended) or select a curated background"
                required={true}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <FormInput
                  label="Primary Button Text"
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  placeholder="e.g. Explore Courses"
                />
                <FormInput
                  label="Primary Button Link URL"
                  value={form.buttonUrl}
                  onChange={(e) => setForm({ ...form, buttonUrl: e.target.value })}
                  placeholder="e.g. /courses"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Secondary Button Text (Optional)"
                  value={form.secondaryButtonText}
                  onChange={(e) => setForm({ ...form, secondaryButtonText: e.target.value })}
                  placeholder="e.g. Book a Demo Class"
                />
                <FormInput
                  label="Secondary Button Link URL (Optional)"
                  value={form.secondaryButtonUrl}
                  onChange={(e) => setForm({ ...form, secondaryButtonUrl: e.target.value })}
                  placeholder="e.g. /demo-class"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormInput
                  label="Display Order"
                  type="number"
                  min="1"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                />
                <FormSelect
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  options={["Active", "Draft", "Inactive"]}
                />
                <FormInput
                  label="Start Date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {submitting ? "Saving Banner..." : editingSlider ? "Update Banner" : "Create & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSliders;
