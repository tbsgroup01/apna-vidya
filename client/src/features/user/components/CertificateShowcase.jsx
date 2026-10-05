import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Eye,
  X,
  ArrowRight,
  Printer,
  Copy,
  Check,
  CheckCircle2,
} from "lucide-react";
import api from "../../../services/api";

const DEFAULT_AWARDS = [
  {
    id: "AVTC-2025-01",
    title: "Certificate of Completion",
    description: "Recognizing successful completion of training programs at ApnaVidya.",
    year: "2025",
    image: "/images/cert_completion_gold.jpg",
    verificationUrl: "/verify-certificate?id=AVTC-2025-01",
    theme: "blue",
    issuer: "ApnaVidya Academic Council (ISO 9001:2015)",
    recipient: "Eleanor Jane Ramsey",
    course: "Full Stack Web Development",
  },
  {
    id: "AVTC-2025-02",
    title: "Demo Award",
    description: "Awarded for outstanding performance and project demonstration.",
    year: "2025",
    image: "/images/cert_completion_blue.jpg",
    verificationUrl: "/verify-certificate?id=AVTC-2025-02",
    theme: "orange",
    issuer: "ApnaVidya Technology Institute",
    recipient: "Alexander James Reed",
    course: "Advanced Data Analytics & AI",
  },
  {
    id: "AVTC-2025-03",
    title: "Certificate",
    description: "Globally recognized certification validating your skills and knowledge.",
    year: "2025",
    image: "/images/cert_award_ornate.jpg",
    verificationUrl: "/verify-certificate?id=AVTC-2025-03",
    theme: "blue",
    issuer: "ApnaVidya Academic Council",
    recipient: "Eleanor Grace Vance",
    course: "Cloud Architecture & Full Stack",
  },
  {
    id: "AVTC-2025-04",
    title: "About",
    description: "I am a Power Platform Developer with expertise in designing and developing...",
    year: "2025",
    image: "/images/developer_headshot.jpg",
    verificationUrl: "/verify-certificate?id=AVTC-2025-04",
    theme: "orange",
    isDeveloperProfile: true,
    issuer: "ApnaVidya Enterprise Council",
    recipient: "Amit Kumar",
    course: "Microsoft Power Platform & Cloud Solutions",
  },
];

const CertificateShowcase = () => {
  const navigate = useNavigate();
  const [awards, setAwards] = useState(DEFAULT_AWARDS);
  const [loading, setLoading] = useState(false);
  const [previewAward, setPreviewAward] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAwards = async () => {
      try {
        const res = await api.get("/public/certificates");
        if (
          isMounted &&
          res.data?.data?.awards &&
          Array.isArray(res.data.data.awards) &&
          res.data.data.awards.length > 0
        ) {
          // Merge API awards with our styled defaults
          const merged = res.data.data.awards.map((item, idx) => ({
            ...DEFAULT_AWARDS[idx % DEFAULT_AWARDS.length],
            ...item,
            theme: idx % 2 === 0 ? "blue" : "orange",
          }));
          setAwards(merged);
        }
      } catch (err) {
        // Fall back gracefully to DEFAULT_AWARDS
      }
    };

    fetchAwards();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewAward(null);
      }
    };
    if (previewAward) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [previewAward]);

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyNavigate = (url) => {
    setPreviewAward(null);
    if (url.startsWith("/")) {
      navigate(url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-100 py-10">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">

        <div
          className="absolute left-4 sm:left-10 top-1/4 h-28 w-28 opacity-60 hidden sm:block"
          style={{
            backgroundImage: "radial-gradient(#f97316 2px, transparent 2px)",
            backgroundSize: "18px 18px",
          }}
        />


        <div className="absolute -top-12 -left-12 h-72 w-72 rounded-full bg-gradient-to-br from-sky-200/40 via-blue-100/20 to-transparent blur-3xl" />

        <svg
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[95%] w-72 lg:w-96 select-none z-0 hidden md:block"
          viewBox="0 0 280 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M280 0 C180 140 140 260 210 390 C250 470 210 550 280 600 L280 600 Z"
            fill="url(#sectionPeachWave)"
            opacity="0.8"
          />
          <path
            d="M280 90 C210 200 180 290 235 410 C270 480 240 560 280 600 L280 600 Z"
            fill="url(#sectionBlueWave)"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="sectionPeachWave" x1="280" y1="0" x2="140" y2="390" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffedd5" />
              <stop offset="0.5" stopColor="#fed7aa" />
              <stop offset="1" stopColor="#fdba74" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="sectionBlueWave" x1="280" y1="90" x2="180" y2="410" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e0f2fe" />
              <stop offset="0.6" stopColor="#bae6fd" />
              <stop offset="1" stopColor="#7dd3fc" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute -bottom-14 -left-14 h-80 w-80 rounded-full bg-gradient-to-tr from-sky-300/30 via-blue-200/15 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <svg
            className="pointer-events-none absolute left-1/2 -top-6 -translate-x-1/2 w-[92%] max-w-2xl h-48 text-blue-200/50 select-none z-0"
            viewBox="0 0 650 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M280 160 C245 130 190 90 200 30"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path d="M275 145 C255 140 245 125 250 110 C265 120 272 133 275 145 Z" fill="currentColor" />
            <path d="M260 115 C240 108 230 94 235 80 C250 88 258 102 260 115 Z" fill="currentColor" />
            <path d="M246 86 C228 80 218 67 223 53 C238 61 245 74 246 86 Z" fill="currentColor" />
            <path d="M232 58 C215 52 206 39 211 26 C225 34 231 46 232 58 Z" fill="currentColor" />
            <path d="M216 32 C204 27 197 17 201 6 C211 14 216 23 216 32 Z" fill="currentColor" />

            <path
              d="M370 160 C405 130 460 90 450 30"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path d="M375 145 C395 140 405 125 400 110 C385 120 378 133 375 145 Z" fill="currentColor" />
            <path d="M390 115 C410 108 420 94 415 80 C400 88 392 102 390 115 Z" fill="currentColor" />
            <path d="M404 86 C422 80 432 67 427 53 C412 61 405 74 404 86 Z" fill="currentColor" />
            <path d="M418 58 C435 52 444 39 439 26 C425 34 419 46 418 58 Z" fill="currentColor" />
            <path d="M434 32 C446 27 453 17 449 6 C439 14 434 23 434 32 Z" fill="currentColor" />
          </svg>

          <div className="relative z-10 mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100/80 bg-[#f0f6ff] px-4 py-1.5 text-xs font-bold text-blue-600 shadow-2xs">
            <Award size={15} className="text-blue-600 stroke-[2.2]" />
            <span>Institutional Honors & Certifications</span>
          </div>
          <h2 className="relative z-10 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] leading-tight">
            Recognized & Certified{" "}
            <span className="relative inline-block">
              by
              <span
                className="absolute -top-2.5 -right-6 text-[#FD8006] select-none font-bold text-xl leading-none inline-flex gap-0.5 tracking-tighter"
                aria-hidden="true"
              >
                //
              </span>
            </span>
            <br className="hidden sm:inline" />
            <span className="text-blue-600">Leading </span>
            <span className="text-[#FD8006]">Global Authorities</span>
          </h2>

          <p className="relative z-10 mt-3.5 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
            ApnaVidya is backed by internationally recognized quality management
            frameworks and honors to ensure your learning credentials hold authentic global value.
          </p>
        </div>


        {loading ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-slate-100 bg-white p-5 space-y-4 shadow-sm"
              >
                <div className="h-44 rounded-2xl bg-slate-100" />
                <div className="h-4 w-1/3 rounded-full bg-slate-100" />
                <div className="h-4 w-3/4 rounded-md bg-slate-100" />
                <div className="h-3 w-full rounded-md bg-slate-100" />
                <div className="h-9 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awards.map((award, idx) => {
              const isOrangeTheme = award.theme === "orange" || idx % 2 === 1;

              return (
                <div
                  key={award.id || idx}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-50/80 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-200"
                >
                  {/* Crisp SVG Corner Wave swoosh inside card matching screenshot */}
                  {!isOrangeTheme ? (
                    /* Blue bottom-left curved wave */
                    <svg
                      className="pointer-events-none absolute bottom-0 left-0 w-36 h-28 select-none z-0 transition-transform duration-500 group-hover:scale-110"
                      viewBox="0 0 160 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 120 L0 55 C25 75 55 90 95 80 C135 70 148 98 160 120 Z"
                        fill="url(#cardBlueWave)"
                        opacity="0.9"
                      />
                      <defs>
                        <linearGradient id="cardBlueWave" x1="0" y1="120" x2="160" y2="55" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#60a5fa" />
                          <stop offset="1" stopColor="#93c5fd" stopOpacity="0.45" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ) : (
                    /* Peach / Orange bottom curved wave */
                    <svg
                      className="pointer-events-none absolute bottom-0 right-0 w-36 h-28 select-none z-0 transition-transform duration-500 group-hover:scale-110"
                      viewBox="0 0 160 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M160 120 L160 55 C135 75 105 90 65 80 C25 70 12 98 0 120 Z"
                        fill="url(#cardOrangeWave)"
                        opacity="0.9"
                      />
                      <defs>
                        <linearGradient id="cardOrangeWave" x1="160" y1="120" x2="0" y2="55" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#fb923c" />
                          <stop offset="1" stopColor="#fed7aa" stopOpacity="0.45" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}

                  <div className="relative z-10">
                    {/* Certificate Thumbnail Box */}
                    <div
                      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50/80 flex items-center justify-center cursor-pointer group/img transition-all group-hover:border-blue-200"
                      onClick={() => setPreviewAward(award)}
                      title="Click to view full certificate"
                    >
                      {/* If developer profile photo (Card 4), render with amber wave behind */}
                      {award.isDeveloperProfile ? (
                        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-b from-sky-50 via-slate-50 to-orange-50/60 flex items-center justify-center">
                          {/* Amber backdrop curve behind portrait */}
                          <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-gradient-to-tr from-amber-400/40 via-orange-300/30 to-transparent blur-md" />
                          <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-gradient-to-tl from-orange-400/30 via-amber-200/20 to-transparent blur-md" />
                          <img
                            src={award.image || "/images/developer_headshot.jpg"}
                            alt={award.title}
                            className="relative z-10 h-full w-auto object-cover rounded-lg shadow-2xs transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <img
                          src={award.image || "/images/cert_completion_gold.jpg"}
                          alt={award.title}
                          className="max-h-full max-w-full object-contain rounded shadow-2xs transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Quick Preview Hover Eye Overlay Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewAward(award);
                        }}
                        className="absolute top-2.5 right-2.5 rounded-xl bg-slate-900/70 p-2 text-white backdrop-blur-xs hover:bg-[#FD8006] transition-all opacity-0 group-hover/img:opacity-100 cursor-pointer shadow-sm"
                        title="Enlarge Certificate"
                      >
                        <Eye size={14} />
                      </button>
                    </div>

                    {/* Meta Details */}
                    <div className="mt-4">
                      {/* Year Badge */}
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 mb-2">
                        <Calendar size={13} className="text-blue-600" />
                        <span>{award.year || "2025"}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-blue-600 transition-colors">
                        {award.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                        {award.description ||
                          "Globally recognized certification validating your skills and knowledge."}
                      </p>
                    </div>
                  </div>

                  {/* Details Button matching screenshot pill */}
                  <div className="relative z-10 mt-5 pt-1">
                    <button
                      type="button"
                      onClick={() => setPreviewAward(award)}
                      className="group/btn flex w-full items-center justify-center gap-1.5 rounded-full bg-[#eef5ff] hover:bg-blue-100/90 text-blue-600 font-bold text-xs py-2.5 px-4 transition-all cursor-pointer border border-blue-100/60 shadow-2xs"
                    >
                      <span>Details</span>
                      <ArrowRight
                        size={14}
                        strokeWidth={2.5}
                        className="transition-transform group-hover/btn:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Modal Lightbox (Full Certificate Functionality) */}
      {previewAward && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewAward(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Box */}
            <div className="relative h-72 sm:h-84 w-full overflow-hidden bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100">
              <img
                src={previewAward.image || "/images/cert_completion_gold.jpg"}
                alt={previewAward.title}
                className="max-h-full max-w-full object-contain rounded-md shadow-md"
              />

              <button
                type="button"
                onClick={() => setPreviewAward(null)}
                className="absolute top-3 right-3 rounded-full bg-slate-900/70 p-2 text-white backdrop-blur-xs hover:bg-rose-600 transition-colors cursor-pointer shadow-md"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content & Verification Info */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-amber-500" />
                    Validity / Year: {previewAward.year || "2025"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck size={15} />
                    Verified Record
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {previewAward.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyId(previewAward.id)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Copy Certificate ID"
                  >
                    {copied ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <Copy size={12} />
                    )}
                    <span>{copied ? "Copied" : "Copy ID"}</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {previewAward.title}
                </h3>
                {previewAward.recipient && (
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    Issued to: {previewAward.recipient} • {previewAward.course}
                  </p>
                )}
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {previewAward.description ||
                    "This credential confirms mastery in designated technical coursework and successful capstone performance."}
                </p>
              </div>

              {previewAward.issuer && (
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
                  <span className="font-semibold text-slate-700">Accredited by:</span>{" "}
                  {previewAward.issuer}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewAward(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
                    title="Print or Save Certificate"
                  >
                    <Printer size={13} />
                    <span>Print / Save</span>
                  </button> */}
                </div>

                {previewAward.verificationUrl && (
                  <button
                    type="button"
                    onClick={() => handleVerifyNavigate(previewAward.verificationUrl)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink size={13} />
                  </button>
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
