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
  title: "Build Your Future With Apna Vidya",
  subtitle: "Learn Today. Lead Tomorrow.",
  description:
    "Learn industry-relevant skills from experienced educators, explore practical courses, and take the next step toward building a successful career.",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
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
          setSliders([DEFAULT_SLIDER]);
        }
      } catch {
        if (isMounted) {
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
    }, 6500);
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
              ? "group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 cursor-pointer"
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
            ? "group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
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
      className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center overflow-hidden bg-slate-50 transition-colors duration-700"
    >
      {/* 1. Mobile Ambient Background Orbs (Restored original soft look for mobile) */}
      <div className="pointer-events-none absolute inset-0 lg:hidden overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      {/* 2. Desktop Full-Screen Background Image (Hidden on mobile) */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden">
        {activeSlide?.image ? (
          <img
            key={activeSlide.image}
            src={activeSlide.image}
            alt={activeSlide.title || "Apna Vidya"}
            className="h-full w-full object-cover object-center transition-all duration-700 ease-out"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100" />
        )}
      </div>

      {/* 3. Text Content & Floating Widgets Layer On Top */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Content Panel */}
          <div className="lg:col-span-8 max-w-2xl py-2 sm:py-4 lg:p-6">
            {/* Subtitle Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 shadow-2xs">
              <Sparkles size={15} className="text-blue-600" />
              <span>{activeSlide?.subtitle || "Learn Today. Lead Tomorrow."}</span>
            </div>

            {/* Headline Title */}
            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {activeSlide?.title || "Build Your Future With Apna Vidya"}
            </h1>

            {/* Description */}
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {activeSlide?.description ||
                "Learn industry-relevant skills from experienced educators, explore practical courses, and take the next step toward building a successful career."}
            </p>

            {/* Action Buttons */}
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

            {/* Slider Dots & Controls (if multiple slides) */}
            {sliders.length > 1 && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                        ? "w-7 bg-blue-600"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 active:scale-95 cursor-pointer transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 active:scale-95 cursor-pointer transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-medium ml-1">
                  {currentIndex + 1} / {sliders.length}
                </span>
              </div>
            )}

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
                  <Users size={17} className="text-blue-600" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">5K+</p>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">Students</p>
              </div>

              <div className="border-l border-slate-200/80 pl-4 sm:pl-5">
                <div className="flex items-center gap-2">
                  <BookOpen size={17} className="text-blue-600" />
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">25+</p>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">Courses</p>
              </div>

              <div className="border-l border-slate-200/80 pl-4 sm:pl-5">
                <div className="flex items-center gap-2">
                  <Award size={17} className="text-blue-600" />
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