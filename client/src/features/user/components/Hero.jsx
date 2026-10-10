import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDemoModal } from "../../../context/DemoModalContext";
import api from "../../../services/api";

const DEFAULT_SLIDER = {
  title: "Build Your Future With APNAVIDYA",
  subtitle: "Learn Today. Lead Tomorrow.",
  description:
    "Learn industry-relevant skills from experienced educators, explore practical courses, and take the next step toward building a successful career.",
  image:
    "",
  buttonText: "Explore Courses",
  buttonUrl: "/courses",
  secondaryButtonText: "Book a Demo Class",
  secondaryButtonUrl: "/demo-class",
};

const Hero = () => {
  const { openDemoModal } = useDemoModal();
  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchHeroSliders = async () => {
      try {
        const res = await api.get("/public/hero-sliders");
        if (isMounted && res.data?.data?.sliders?.length > 0) {
          setSliders(res.data.data.sliders);
        } else if (isMounted) {
          const local = localStorage.getItem("apna_vidya_hero_sliders");
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (parsed?.length > 0) {
                setSliders(parsed);
                return;
              }
            } catch { }
          }
          setSliders([DEFAULT_SLIDER]);
        }
      } catch {
        if (isMounted) {
          const local = localStorage.getItem("apna_vidya_hero_sliders");
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (parsed?.length > 0) {
                setSliders(parsed);
                return;
              }
            } catch { }
          }
          setSliders([DEFAULT_SLIDER]);
        }
      }
    };
    fetchHeroSliders();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (sliders.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [sliders.length, isHovered]);

  const activeSlide = sliders.length > 0 ? sliders[currentIndex] : DEFAULT_SLIDER;

  const handleNext = () => {
    if (sliders.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
  };

  const handlePrev = () => {
    if (sliders.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  const renderButton = (text, url, isPrimary = true) => {
    if (!text) return null;
    const isDemo =
      url === "/demo-class" ||
      url === "/demo" ||
      (url && url.toLowerCase().includes("demo"));

    if (isDemo) {
      return (
        <button
          key={`${text}-${url}`}
          type="button"
          onClick={() => openDemoModal()}
          className={
            isPrimary
              ? "group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FD8006] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg active:scale-95 cursor-pointer"
              : "group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600 active:scale-95 cursor-pointer"
          }
        >
          {!isPrimary && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <Play size={13} fill="currentColor" />
            </span>
          )}
          <span>{text}</span>
          {isPrimary && (
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>
      );
    }

    return (
      <Link
        key={`${text}-${url}`}
        to={url || "/courses"}
        className={
          isPrimary
            ? "group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FD8006] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg active:scale-95"
            : "group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600 active:scale-95"
        }
      >
        <span>{text}</span>
        {isPrimary && (
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </Link>
    );
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-[auto] lg:min-h-[88vh] flex items-center overflow-hidden bg-slate-50 pt-3 pb-8 sm:pt-4 sm:pb-12 lg:py-0 transition-colors duration-700"
    >
      <style>{`
        .tbs_glass {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(14.75px);
          -webkit-backdrop-filter: blur(14.75px);
          border-radius: 20px;
          border-left: 1.5px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      {/* 1. Mobile Ambient Background Orbs */}
      <div className="pointer-events-none absolute inset-0 lg:hidden overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-100/30 blur-3xl" />
      </div>

      {/* 2. Desktop Full-Width Background Image (Content sits on this image on desktop) */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden">
        {activeSlide?.image ? (
          <img
            key={activeSlide.image}
            src={activeSlide.image}
            alt={activeSlide.title || "APNAVIDYA"}
            style={{ objectPosition: "right center" }}
            className="h-full w-full object-cover object-right transition-all duration-700 ease-out"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100" />
        )}

        {/* Soft gradient scrim on desktop to ensure crisp readability of text on image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/60 to-transparent w-full lg:w-3/5" />
      </div>

      {/* Desktop Slide Navigation Arrows on the edges */}
      {sliders.length > 1 && (
        <div className="hidden lg:block pointer-events-none">
          <button
            type="button"
            onClick={handlePrev}
            className="pointer-events-auto absolute left-3 xl:left-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-lg backdrop-blur-md transition-all opacity-80 hover:opacity-100 active:scale-90 hover:scale-105 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="pointer-events-auto absolute right-3 xl:right-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-lg backdrop-blur-md transition-all opacity-80 hover:opacity-100 active:scale-90 hover:scale-105 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        {/* ========================================================
            MOBILE ONLY: BANNER IMAGE ON TOP (image upar banner image upar)
           ======================================================== */}
        <div className="lg:hidden mb-6 relative w-full overflow-hidden rounded-2xl shadow-lg border border-slate-200/90 bg-slate-900 group">
          <div className="relative w-full h-auto select-none">
            {activeSlide?.image ? (
              <img
                key={activeSlide.image || currentIndex}
                src={activeSlide.image}
                alt={activeSlide.title || "APNAVIDYA Banner"}
                className="h-full w-full object-cover object-center transition-all duration-700 ease-out"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                  <GraduationCap size={36} strokeWidth={1.5} />
                </div>
                <p className="text-xl font-extrabold tracking-tight">APNAVIDYA</p>
                <p className="mt-1 text-xs text-blue-100 font-medium">
                  Learn • Grow • Succeed
                </p>
              </div>
            )}

            {/* Subtle bottom vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/15" />

            {/* Mobile Banner Slider Arrow Controls */}
            {sliders.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow-md backdrop-blur-md transition-all active:scale-90 z-10 cursor-pointer"
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow-md backdrop-blur-md transition-all active:scale-90 z-10 cursor-pointer"
                  aria-label="Next banner"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Mobile Dot Indicators & Count */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1 z-10">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                        ? "w-5 bg-[#FD8006]"
                        : "w-1.5 bg-white/60 hover:bg-white"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] text-white/90 font-medium ml-1">
                    {currentIndex + 1}/{sliders.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ========================================================
            CONTENT: DOWN ON MOBILE, ON IMAGE ON DESKTOP
           ======================================================== */}
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="tbs_glass lg:col-span-8 max-w-2xl py-1 sm:py-2 lg:p-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 shadow-2xs">
              <Sparkles size={15} className="text-[#FD8006]" />
              <span>{activeSlide?.subtitle || "Learn Today. Lead Tomorrow."}</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.18] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {activeSlide?.title || "Build Your Future With APNAVIDYA"}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {activeSlide?.description ||
                "Learn industry-relevant skills from experienced educators, explore practical courses, and take the next step toward building a successful career."}
            </p>

            <div className="mt-6 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              {renderButton(
                activeSlide?.buttonText || "Explore Courses",
                activeSlide?.buttonUrl || "/courses",
                true
              )}

              {activeSlide?.secondaryButtonText &&
                renderButton(
                  activeSlide.secondaryButtonText,
                  activeSlide.secondaryButtonUrl || "/demo-class",
                  false
                )}
            </div>


            {/* Feature Checkpoints */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200/80 pt-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Practical Learning</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Expert Mentors</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Career Focused</span>
              </div>

            </div>

            {/* Statistics Row */}
            <div className="mt-6 grid grid-cols-3 border-t border-slate-200/80 pt-5">
              <div>
                <div className="flex items-center gap-2">
                  <Users size={17} className="text-[#FD8006]" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">5K+</p>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">Students</p>
              </div>

              <div className="border-l border-slate-200/80 pl-4 sm:pl-5">
                <div className="flex items-center gap-2">
                  <BookOpen size={17} className="text-[#FD8006]" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">25+</p>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">Courses</p>
              </div>

              <div className="border-l border-slate-200/80 pl-4 sm:pl-5">
                <div className="flex items-center gap-2">
                  <Award size={17} className="text-[#FD8006]" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">95%</p>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">Completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-6 bg-white [clip-path:ellipse(55%_100%_at_50%_100%)] pointer-events-none z-10" />
    </section>
  );
};

export default Hero;
