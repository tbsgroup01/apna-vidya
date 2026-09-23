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
              ? "group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 cursor-pointer"
              : "group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
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
            ? "group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
            : "group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
      className="relative overflow-hidden bg-slate-50 transition-colors duration-700"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all duration-300">
              <Sparkles size={16} />
              <span className="font-semibold">
                {activeSlide?.subtitle || "Learn Today. Lead Tomorrow."}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl min-h-[120px] transition-opacity duration-300">
              {activeSlide?.title || "Build Your Future With Apna Vidya"}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg min-h-[56px] transition-opacity duration-300">
              {activeSlide?.description ||
                "Learn industry-relevant skills from experienced educators, explore practical courses, and take the next step toward building a successful career."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

            {sliders.length > 1 && (
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {sliders.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === idx
                          ? "w-8 bg-blue-600"
                          : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 active:scale-95 cursor-pointer transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 active:scale-95 cursor-pointer transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  {currentIndex + 1} / {sliders.length}
                </span>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 size={18} className="text-green-500" />
                Practical Learning
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 size={18} className="text-green-500" />
                Expert Mentors
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 size={18} className="text-green-500" />
                Career Focused
              </div>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-slate-200 pt-7">
              <div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  <p className="text-2xl font-bold text-slate-900">5K+</p>
                </div>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">Students</p>
              </div>

              <div className="border-l border-slate-200 pl-5">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600" />
                  <p className="text-2xl font-bold text-slate-900">25+</p>
                </div>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">Courses</p>
              </div>

              <div className="border-l border-slate-200 pl-5">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-blue-600" />
                  <p className="text-2xl font-bold text-slate-900">95%</p>
                </div>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">Completion</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative mx-auto max-w-[540px]">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-100/70 via-indigo-50/50 to-cyan-100/60 blur-xl" />

              <div className="relative overflow-hidden rounded-3xl border-4 border-white bg-slate-900 shadow-2xl shadow-blue-900/15 aspect-[4/3] sm:aspect-[14/11]">
                {activeSlide?.image ? (
                  <img
                    key={activeSlide.image}
                    src={activeSlide.image}
                    alt={activeSlide.title || "Apna Vidya"}
                    className="h-full w-full object-cover transition-all duration-700 ease-in-out hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
                      <GraduationCap size={60} strokeWidth={1.4} />
                    </div>
                    <p className="text-2xl font-bold">Apna Vidya</p>
                    <p className="mt-1 text-sm text-blue-100">
                      Learn • Grow • Succeed
                    </p>
                  </div>
                )}
              </div>

              <div className="absolute -left-4 top-10 rounded-2xl border border-white/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-xs sm:-left-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 shadow-xs">
                    <Users size={21} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 leading-tight">5,000+</p>
                    <p className="text-xs text-slate-500">Active Students</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 bottom-6 rounded-2xl border border-white/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-xs sm:-right-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-xs">
                    <BookOpen size={21} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">25+ Courses</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Star size={13} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-slate-500 font-medium">Industry Focused</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-6 -top-5 hidden rounded-2xl border border-white/90 bg-white/95 p-2.5 shadow-xl backdrop-blur-xs sm:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 shadow-xs">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Certified Learning</p>
                    <p className="text-[10px] text-slate-500 font-medium">Build your credentials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-6 bg-white [clip-path:ellipse(55%_100%_at_50%_100%)]" />
    </section>
  );
};

export default Hero;