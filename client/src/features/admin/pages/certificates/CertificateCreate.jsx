import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Calendar,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Check,
} from "lucide-react";


import PageHeader from "../../components/PageHeader";
import { ImageUploadPreview } from "../../components/FormControls";
import api from "../../../../services/api";



const PRESET_IMAGES = [
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

const CertificateCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    year: "2025",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    verificationUrl: "",
    description: "",
    status: "Active",
    featured: true,
    orderIndex: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Award or certificate title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/admin/certificates", formData);
      navigate("/admin/certificates");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save award. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Add Institutional Award"
        description="Register institutional credentials, quality management certifications, or honors into the database for website showcase."
        breadcrumbs={[
          { label: "Awards Showcase", path: "/admin/certificates" },
          { label: "Add Award" },
        ]}
        actions={
          <Link
            to="/admin/certificates"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to Showcase</span>
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6"
      >
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
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

          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[13px]late-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 focus:border-blue-500 focus:outline-hidden cursor-pointer"
            >
              <option value="Active">Active (Live in Showcase)</option>
              <option value="Draft">Draft (Internal)</option>
              <option value="Archived">Archived</option>
            </select>
          </div>



          <div className="sm:col-span-2">
            <ImageUploadPreview
              label="Badge / Certificate Image (less than 1MB)"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              aspect="video"
              presets={PRESET_IMAGES}
              helperText="Upload certificate graphic / badge or pick a verified preset (max 1MB)"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-[13px]late-700">
              Scope of Recognition / Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detail the recognition framework, audit achievements, or excellence recognized by this award..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-[13px]late-900 placeholder:text-[13px]late-400 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-6 pt-2">
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
                Feature on Public Website Spotlight
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
                className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs text-center text-[13px]late-900"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Link
            to="/admin/certificates"
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Link>


          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-all active:scale-95"
          >
            {loading ? (
              <span>Saving to Database...</span>
            ) : (
              <>
                <Save size={15} />
                <span>Save to Showcase</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateCreate;
