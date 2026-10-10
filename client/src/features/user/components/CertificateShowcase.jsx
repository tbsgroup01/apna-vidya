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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../../services/api";

const DEFAULT_AWARDS = [
  {
    id: 1,
    title: "Certificate of Academic Excellence (ISO 9001:2015)",
    description: "Certified for maintaining benchmark quality management standards in digital education, practical training methodologies, and mentor-led curriculums.",
    year: "2025",
    image: "/images/cert_completion_gold.jpg",
    verificationUrl: "https://APNAVIDYA.com/verify/ISO-9001-2025",
    issuer: "International Academic Standards Organization",
    theme: "blue",
  },
  {
    id: 2,
    title: "National Ed-Tech Innovation Award",
    description: "Awarded in recognition of innovative live online mentoring, interactive doubt resolution windows, and student placement empowerment across tier-1 and tier-2 cities.",
    year: "2025",
    image: "/images/cert_completion_blue.jpg",
    verificationUrl: "https://APNAVIDYA.com/verify/EDTECH-INNOV-2025",
    issuer: "National Council for Skill Advancement",
    theme: "orange",
  },
  {
    id: 3,
    title: "Authorized Technology Learning Partner",
    description: "Official academic accreditation verifying curriculum alignment with current industry-demanded tech competencies, modern cloud platforms, and full stack frameworks.",
    year: "2025",
    image: "/images/cert_award_ornate.jpg",
    verificationUrl: "https://APNAVIDYA.com/verify/TECH-PARTNER-2025",
    issuer: "Global Tech Education Consortium",
    theme: "blue",
  },
  {
    id: 4,
    title: "Certified Professional Skill Development Institute",
    description: "Honored for empowering over 5,000+ learners across India with job-ready tech proficiencies, practical coding portfolios, and verifiable career credentials.",
    year: "2025",
    image: "/images/cert_completion_gold.jpg",
    verificationUrl: "https://APNAVIDYA.com/verify/SKILL-INDIA-2025",
    issuer: "Skill India Development Forum",
    theme: "orange",
  },
  {
    id: 5,
    title: "Global AI & Data Science Education Accreditation",
    description: "Accredited for curriculum excellence in machine learning, generative AI architectures, and practical neural networks.",
    year: "2025",
    image: "/images/cert_award_ornate.jpg",
    verificationUrl: "https://APNAVIDYA.com/verify/AI-DATA-2025",
    issuer: "International Artificial Intelligence Alliance",
    theme: "blue",
  },
  {
    id: 6,
    title: "Emerging EdTech Leader of the Year",
    description: "Recognized as a premier high-impact tech training platform empowering career transitioners and college graduates with job-ready skills.",
    year: "2025",
    image: "/images/cert_completion_blue.jpg",
    verificationUrl: "https://APNAVIDYA.com/verify/EDTECH-LEADER-2025",
    issuer: "Asia Education Leadership Summit",
    theme: "orange",
  },
];

const CertificateShowcase = () => {
  const navigate = useNavigate();
  const [awards, setAwards] = useState(DEFAULT_AWARDS);
  const [loading, setLoading] = useState(false);
  const [previewAward, setPreviewAward] = useState(null);
  const [copied, setCopied] = useState(false);

  // Carousel & Window state (matching VideoSection)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerView = windowWidth >= 1024 ? 4 : windowWidth >= 640 ? 2 : 1;
  const maxIndex = Math.max(0, awards.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const translatePercent = currentIndex * (100 / itemsPerView);

  // Touch Swipe handlers for mobile/tablet
  const minSwipeDistance = 50;
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Dynamic API Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/certificates");
        if (
          isMounted &&
          res.data?.data?.awards &&
          Array.isArray(res.data.data.awards) &&
          res.data.data.awards.length > 0
        ) {
          // Dynamic certificates directly from the API with alternating theme
          const dynamicAwards = res.data.data.awards.map((item, idx) => ({
            ...item,
            theme: idx % 2 === 0 ? "blue" : "orange",
          }));
          setAwards(dynamicAwards);
        }
      } catch (err) {
        // Fall back gracefully to DEFAULT_AWARDS
      } finally {
        if (isMounted) setLoading(false);
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
    navigator.clipboard.writeText(String(id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyNavigate = (url) => {
    setPreviewAward(null);
    if (!url) return;
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
        <div className="relative mb-12 flex flex-col items-center justify-center text-center">
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
            APNAVIDYA is backed by internationally recognized quality management
            frameworks and honors to ensure your learning credentials hold authentic global value.
          </p>

          {/* Carousel Arrows on Top-Right (matching VideoSection) */}
          {awards.length > itemsPerView && (
            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-2xs hover:bg-blue-50 hover:shadow-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Previous certificates"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-white text-[#FD8006] shadow-2xs hover:bg-orange-50 hover:shadow-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Next certificates"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
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
          /* Carousel Container matching VideoSection */
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out py-2"
              style={{
                transform: `translateX(-${translatePercent}%)`,
              }}
            >
              {awards.map((award, idx) => {
                const isOrangeTheme = award.theme === "orange" || idx % 2 === 1;

                return (
                  <div
                    key={award.id || idx}
                    className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-3 flex flex-col"
                  >
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-50/80 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-200 h-full">
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
                          <img
                            src={award.image || (isOrangeTheme ? "/images/cert_completion_blue.jpg" : "/images/cert_completion_gold.jpg")}
                            alt={award.title || "Certificate"}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = isOrangeTheme
                                ? "/images/cert_completion_blue.jpg"
                                : "/images/cert_completion_gold.jpg";
                            }}
                            className="max-h-full max-w-full object-contain rounded shadow-2xs transition-transform duration-500 group-hover:scale-105"
                          />

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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Carousel Pagination Dots (matching VideoSection) */}
        {awards.length > itemsPerView && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === dotIdx
                  ? "w-7 bg-[#FD8006]"
                  : "w-2 bg-blue-100 hover:bg-blue-200"
                  }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
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
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/cert_completion_gold.jpg";
                }}
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
