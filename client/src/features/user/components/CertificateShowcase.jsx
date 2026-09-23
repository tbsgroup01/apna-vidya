import React, { useState, useEffect } from "react";
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Sparkles,
  Eye,
  X,
  ChevronRight,
} from "lucide-react";

import api from "../../../services/api";

const CertificateShowcase = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewAward, setPreviewAward] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/certificates");
        if (res.data?.data?.awards) {
          setAwards(res.data.data.awards);
        }
      } catch (err) {
        console.error("Failed to fetch public awards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  if (!loading && awards.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs backdrop-blur-xs">
            <Sparkles size={14} className="text-blue-600 animate-pulse" />
            <span>Institutional Honors & Certifications</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Recognized & Certified by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Leading Global Authorities
            </span>
          </h2>

          <p className="mt-4 text-base text-slate-600 sm:text-lg leading-relaxed">
            Apna Vidya is backed by internationally recognized quality management
            frameworks and honors to ensure your learning credentials hold authentic global value.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
              >
                <div className="h-44 rounded-xl bg-slate-100" />
                <div className="h-4 w-3/4 rounded-sm bg-slate-100" />
                <div className="h-3 w-1/2 rounded-sm bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((award) => (
              <div
                key={award.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={
                        award.image ||
                        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={award.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {award.featured && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/95 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs shadow-xs">
                          <Sparkles size={10} />
                          Featured
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewAward(award)}
                      className="absolute top-3 right-3 rounded-lg bg-slate-900/60 p-1.5 text-white backdrop-blur-xs hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Quick Preview"
                    >
                      <Eye size={14} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 text-slate-200">
                        <Calendar size={12} className="text-amber-400" />
                        {award.year}
                      </span>
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <ShieldCheck size={12} />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {award.title}
                    </h3>

                    {award.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {award.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    {award.verificationUrl ? (
                      <a
                        href={award.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <span>Official Registry</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        Verified Record
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPreviewAward(award)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <span>Details</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>

      {previewAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-60 w-full overflow-hidden bg-slate-100">
              <img
                src={
                  previewAward.image ||
                  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
                }
                alt={previewAward.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <button
                type="button"
                onClick={() => setPreviewAward(null)}
                className="absolute top-3 right-3 rounded-full bg-slate-900/60 p-1.5 text-white backdrop-blur-xs hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold text-white drop-shadow-xs">
                  {previewAward.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 border-b border-slate-100 pb-3">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-amber-500" />
                  Validity / Year: {previewAward.year}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <ShieldCheck size={14} />
                  Verified Record
                </span>
              </div>

              {previewAward.description && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Scope of Award
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {previewAward.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPreviewAward(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>

                {previewAward.verificationUrl && (
                  <a
                    href={previewAward.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <span>Verify with Issuer</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificateShowcase;
