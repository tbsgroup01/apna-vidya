import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Trash2,
  Calendar,
  Sparkles,
  LayoutGrid,
  List,
  X,
  AlertCircle,
  Check,
  Eye,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import ConfirmModal from "../../components/ConfirmModal";
import { ImageUploadPreview } from "../../components/FormControls";
import api from "../../../../services/api";

const STATUS_OPTIONS = ["All", "Active", "Draft", "Archived"];

const SAMPLE_IMAGE_PRESETS = [
  {
    label: "Quality Standard (ISO)",
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Excellence Trophy",
    url: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Industry Partnership",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Government Laureate",
    url: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?auto=format&fit=crop&w=600&q=80",
  },
];

const INITIAL_FORM = {
  title: "",
  year: "2025",
  image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
  verificationUrl: "",
  description: "",
  status: "Active",
  featured: true,
  orderIndex: 0,
};

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];

const CertificatesList = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedAwardIds, setSelectedAwardIds] = useState([]);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [awardToDelete, setAwardToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchAwards = async () => {
    try {
      setLoading(true);
      let response;
      try {
        response = await api.get("/admin/certificates");
      } catch (adminErr) {
        response = await api.get("/public/certificates");
      }
      if (response?.data?.data?.awards) {
        setAwards(response.data.data.awards);
      }
    } catch (err) {
      console.error("Error loading awards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const filteredAwards = useMemo(() => {
    return awards.filter((award) => {
      const matchesStatus =
        selectedStatus === "All" || award.status === selectedStatus;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        award.title?.toLowerCase().includes(query) ||
        award.description?.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [awards, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filteredAwards.length / pageSize) || 1;
  const paginatedAwards = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAwards.slice(start, start + pageSize);
  }, [filteredAwards, currentPage, pageSize]);

  const handleSelectAll = (e) => {
    const pageIds = paginatedAwards.map((a) => a.id);
    if (e.target.checked) {
      setSelectedAwardIds(Array.from(new Set([...selectedAwardIds, ...pageIds])));
    } else {
      setSelectedAwardIds(selectedAwardIds.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedAwardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDelete = async () => {
    if (!selectedAwardIds.length) return;
    try {
      setBulkDeleting(true);
      const res = await api.post("/admin/certificates/bulk-delete", { ids: selectedAwardIds });
      if (res.data.success) {
        setAwards((prev) => prev.filter((a) => !selectedAwardIds.includes(a.id)));
        setBulkDeleteModalOpen(false);
        setSelectedAwardIds([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to bulk delete certificates");
    } finally {
      setBulkDeleting(false);
    }
  };

  const stats = useMemo(() => {
    const total = awards.length;
    const active = awards.filter((a) => a.status === "Active").length;
    const featured = awards.filter((a) => a.featured).length;
    const verifiedLinks = awards.filter((a) => Boolean(a.verificationUrl)).length;
    return { total, active, featured, verifiedLinks };
  }, [awards]);

  const handleOpenAddModal = () => {
    setEditingAward(null);
    setFormData({
      ...INITIAL_FORM,
      orderIndex: awards.length + 1,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (award) => {
    setEditingAward(award);
    setFormData({
      title: award.title || "",
      year: award.year || "2025",
      image: award.image || "",
      verificationUrl: award.verificationUrl || "",
      description: award.description || "",
      status: award.status || "Active",
      featured: Boolean(award.featured),
      orderIndex: award.orderIndex || 0,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Award or certificate title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      if (editingAward) {
        await api.put(`/admin/certificates/${editingAward.id}`, formData);
      } else {
        await api.post("/admin/certificates", formData);
      }

      setModalOpen(false);
      await fetchAwards();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to save award. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (award) => {
    setAwardToDelete(award);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!awardToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/admin/certificates/${awardToDelete.id}`);
      setDeleteModalOpen(false);
      setAwardToDelete(null);
      await fetchAwards();
    } catch (err) {
      console.error("Failed to delete award:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Awards & Accreditations Showcase"
        description="Showcase ApnaVidya's institutional credentials, honors, and certifications."
        breadcrumbs={[{ label: "Awards Showcase" }]}
        actions={
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Award</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Recognitions"
          value={stats.total.toString()}
          change="Institutional Honors"
          isPositive={true}
          comparison="Stored in Database"
          icon="Award"
          color="blue"
        />
        <StatCard
          title="Active in Showcase"
          value={stats.active.toString()}
          change="Currently Published"
          isPositive={true}
          comparison="Visible on Website"
          icon="ShieldCheck"
          color="emerald"
        />
        <StatCard
          title="Featured on Portal"
          value={stats.featured.toString()}
          change="Homepage Highlighted"
          isPositive={true}
          comparison="Public Spotlight"
          icon="Sparkles"
          color="purple"
        />
        <StatCard
          title="Verifiable Links"
          value={stats.verifiedLinks.toString()}
          change="Official Registry URLs"
          isPositive={true}
          comparison="Live Verification"
          icon="CheckCircle2"
          color="indigo"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px]late-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search awards by title or description..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[13px]late-700 hover:border-slate-300 focus:border-blue-500 focus:outline-hidden cursor-pointer"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>

            <div className="flex items-center rounded-xl border border-slate-200 p-1 bg-slate-50/80">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-1.5 transition-colors cursor-pointer ${viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-[13px]late-400 hover:text-[13px]late-700"
                  }`}
                title="Grid Card View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-lg p-1.5 transition-colors cursor-pointer ${viewMode === "table"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-[13px]late-400 hover:text-[13px]late-700"
                  }`}
                title="Table View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedAwardIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-blue-50/90 px-4 py-2.5 border border-blue-100 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center h-5 px-2 rounded-full bg-[#FD8006] text-[13px] font-bold text-white">
              {selectedAwardIds.length}
            </span>
            <span className="text-xs font-semibold text-blue-900">
              certificate{selectedAwardIds.length > 1 ? "s" : ""} selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedAwardIds([])}
              className="text-xs text-blue-600 hover:text-blue-800 underline font-medium ml-2 cursor-pointer"
            >
              Clear selection
            </button>
          </div>
          <button
            type="button"
            onClick={() => setBulkDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Delete Selected ({selectedAwardIds.length})</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
            >
              <div className="h-44 rounded-xl bg-slate-100" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded-sm bg-slate-100" />
                <div className="h-3 w-1/2 rounded-sm bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredAwards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Award size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-[13px]late-900">
            No awards or certificates match your criteria
          </h3>
          <p className="mt-1 text-xs text-[13px]late-500 max-w-sm mx-auto">
            Try adjusting your search terms, or add your first award or certificate to the showcase.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add First Award</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {paginatedAwards.map((award) => (
            <div
              key={award.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div>
                {/* Card Top Toolbar with Status & Actions */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAwardIds.includes(award.id)}
                      onChange={() => handleSelectOne(award.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-xs"
                    />
                    {award.featured && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px] font-bold border border-amber-200">
                        <Sparkles size={11} />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${award.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : award.status === "Draft"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                    >
                      {award.status}
                    </span>
                  </div>
                </div>

                {/* Certificate Image Frame - 100% Uncropped Full View */}
                <div
                  onClick={() => setPreviewImage({ url: award.image, title: award.title })}
                  className="relative h-56 w-full overflow-hidden bg-slate-50 flex items-center justify-center p-3 border-b border-slate-100 cursor-pointer group/img"
                  title="Click to view full certificate"
                >
                  <img
                    src={
                      award.image ||
                      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={award.title}
                    className="max-h-full max-w-full object-contain rounded shadow-xs transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover/img:bg-slate-900/10 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg bg-slate-900/80 text-white px-3 py-1.5 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                      <Eye size={13} /> View Full
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                      <Calendar size={13} className="text-blue-600" />
                      {award.year}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2" title={award.title}>
                    {award.title}
                  </h4>

                  {award.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed" title={award.description}>
                      {award.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 flex items-center justify-between gap-2">
                {award.verificationUrl ? (
                  <a
                    href={award.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-xs font-medium text-slate-400">
                    Institutional Record
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(award)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Award"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(award)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete Award"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[13px]late-500 font-semibold uppercase tracking-wider text-[13px]">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedAwards.length > 0 &&
                        paginatedAwards.every((a) => selectedAwardIds.includes(a.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Award Title & Scope</th>
                  <th className="py-3 px-4">Year / Validity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAwards.map((award) => (
                  <tr key={award.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedAwardIds.includes(award.id)}
                        onChange={() => handleSelectOne(award.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            award.image ||
                            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={award.title}
                          className="h-10 w-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="max-w-md">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[13px]late-900 leading-snug">
                              {award.title}
                            </span>
                            {award.featured && (
                              <span className="rounded-md bg-amber-50 text-amber-700 px-1.5 py-0.2 text-[12px] font-bold border border-amber-200">
                                Featured
                              </span>
                            )}
                          </div>
                          {award.description && (
                            <p className="text-[13px] text-[13px]late-400 line-clamp-1 mt-0.5">
                              {award.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[13px]late-600">
                      {award.year}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-semibold ${award.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : award.status === "Draft"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-[13px]late-600 border border-slate-200"
                          }`}
                      >
                        {award.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {award.verificationUrl ? (
                        <a
                          href={award.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                        >
                          <span>Verify</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-[13px]late-400 font-mono text-[13px]">
                          Internal
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(award)}
                          className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(award)}
                          className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredAwards.length > 0 && (
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border border-slate-200 rounded-2xl bg-white text-xs text-[13px]late-500 shadow-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              Showing{" "}
              <span className="font-semibold text-[13px]late-800">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[13px]late-800">
                {Math.min(currentPage * pageSize, filteredAwards.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[13px]late-800">
                {filteredAwards.length}
              </span>{" "}
              results
            </div>

            <div className="flex items-center gap-2">
              <span>Cards per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-1 text-xs font-semibold text-[13px]late-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} / page
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-7 w-7 rounded-lg font-bold text-xs transition-colors cursor-pointer ${currentPage === page
                      ? "bg-[#FD8006] text-white"
                      : "hover:bg-slate-100 text-[13px]late-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-100">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-[13px]late-900">
                  {editingAward
                    ? "Edit Award / Certification"
                    : "Add Institutional Award"}
                </h3>
                <p className="text-xs text-[13px]late-500">
                  Store award details in database for portal showcase
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-[13px]late-400 hover:bg-slate-100 hover:text-[13px]late-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[13px]late-700">
                    Award or Certification Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. ISO 9001:2015 Quality Management Standard"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[13px]late-700">
                    Year / Validity
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    placeholder="e.g. 2025 or 2024 - 2027"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[13px]late-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-[13px]late-900 focus:border-blue-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[13px]late-700">
                    Official Verification URL
                  </label>
                  <input
                    type="url"
                    value={formData.verificationUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, verificationUrl: e.target.value })
                    }
                    placeholder="https://cert.verificationregistry.com/verify/..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
                  />
                </div> */}

                <div className="sm:col-span-2">
                  <ImageUploadPreview
                    label="Badge / Certificate Image"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    aspect="video"
                    presets={SAMPLE_IMAGE_PRESETS}
                    helperText="Upload certificate graphic / badge or pick a verified preset"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[13px]late-700">
                    Description / Scope of Award
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the significance of this award or recognized curriculum excellence..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-6 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[13px]late-700">
                      Feature on Homepage Showcase
                    </span>
                  </label>

                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs font-bold text-[13px]late-700">
                      Display Order:
                    </span>
                    <input
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          orderIndex: Number(e.target.value),
                        })
                      }
                      className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-xs text-center text-[13px]late-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingAward ? "Update Award" : "Save Award"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Institutional Award?"
        message={`Are you sure you want to delete "${awardToDelete?.title}"? This will permanently remove it from the showcase and database.`}
        confirmText="Delete Credential"
        type="danger"
        loading={deleting}
      />

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Bulk Delete Certificates?"
        message={`Are you sure you want to permanently delete the ${selectedAwardIds.length} selected certificate(s)? This will remove them from the showcase and database.`}
        confirmText={bulkDeleting ? "Deleting..." : `Delete (${selectedAwardIds.length}) Certificates`}
        type="danger"
        loading={bulkDeleting}
      />

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden rounded-2xl bg-white p-2 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900 truncate pr-4">
                {previewImage.title || "Certificate Preview"}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center p-4 bg-slate-50 max-h-[78vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title || "Certificate"}
                className="max-h-[72vh] max-w-full object-contain rounded-md shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesList;
