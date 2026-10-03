import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Sparkles,
  Award,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import api from "../../../../services/api";

const CertificateDetails = () => {
  const { id } = useParams();
  const [award, setAward] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAward = async () => {
      try {
        setLoading(true);
        let response;
        try {
          response = await api.get(`/admin/certificates/${id}`);
        } catch {
          response = await api.get("/public/certificates");
          const found = response?.data?.data?.awards?.find(
            (a) => String(a.id) === String(id)
          );
          if (found) {
            setAward(found);
            return;
          }
        }
        if (response?.data?.data?.award) {
          setAward(response.data.data.award);
        }
      } catch (err) {
        console.error("Failed to load award:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAward();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-12 text-center">
        <div className="animate-spin inline-block h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-xs text-[13px]late-500 font-semibold">Loading award details...</p>
      </div>
    );
  }

  if (!award) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-12 text-center">
        <Award size={36} className="mx-auto text-[13px]late-400" />
        <h2 className="text-base font-bold text-[13px]late-900">Award Not Found</h2>
        <p className="text-xs text-[13px]late-500">The requested institutional award could not be located in the database.</p>
        <Link
          to="/admin/certificates"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft size={14} />
          <span>Back to Showcase</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={award.title}
        description="Institutional credential and certification details"
        breadcrumbs={[
          { label: "Awards Showcase", path: "/admin/certificates" },
          { label: award.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/certificates"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back to Showcase</span>
            </Link>
            {award.verificationUrl && (
              <a
                href={award.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                <ExternalLink size={15} />
                <span>Verify Credential</span>
              </a>
            )}
          </div>
        }
      />

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
          <img
            src={
              award.image ||
              "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
            }
            alt={award.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            {award.featured && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/95 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs shadow-xs">
                <Sparkles size={12} />
                Featured Showcase
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4">
            <span
              className={`rounded-lg px-3 py-1 text-xs font-bold shadow-xs backdrop-blur-xs ${award.status === "Active"
                ? "bg-emerald-500/95 text-white"
                : award.status === "Draft"
                  ? "bg-amber-500/95 text-white"
                  : "bg-slate-700/95 text-white"
                }`}
            >
              {award.status}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
              {award.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[13px]late-200">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-400" />
                {award.year}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Database Verified
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-[13px]m font-bold uppercase tracking-wider text-[13px]late-400">
              Description & Scope of Award
            </h3>
            <p className="mt-2 text-[13px]m text-[13px]late-700 leading-relaxed">
              {award.description ||
                "Official institutional honor recognizing quality, achievement, or curricular rigor."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[13px]late-400">
                Year / Validity
              </span>
              <p className="mt-1 text-xs font-bold text-[13px]late-900">
                {award.year}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[13px]late-400">
                Display Order
              </span>
              <p className="mt-1 text-xs font-bold text-[13px]late-900">
                Rank #{award.orderIndex || 1}
              </p>
            </div>
          </div>

          {award.verificationUrl && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-blue-900">
                  External Verification Endpoint
                </h4>
                <p className="text-[13px] font-mono text-blue-600 truncate max-w-lg">
                  {award.verificationUrl}
                </p>
              </div>
              <a
                href={award.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shrink-0 self-start sm:self-auto"
              >
                <span>Visit Official Registry</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateDetails;
