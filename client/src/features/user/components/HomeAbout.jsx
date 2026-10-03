import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Landmark,
  Target,
  GraduationCap,
  Users,
} from "lucide-react";
import api from "../../../services/api";
import { useDemoModal } from "../../../context/DemoModalContext";
import gradCapBooks from "../../../assets/grad-cap-books.png";

const HomeAbout = () => {
  const [aboutData, setAboutData] = useState(null);
  const { openDemoModal } = useDemoModal();

  useEffect(() => {
    let isMounted = true;
    const fetchAbout = async () => {
      try {
        const res = await api.get("/public/about");
        if (isMounted && res.data?.data?.about) {
          setAboutData(res.data.data.about);
        }
      } catch {
        if (isMounted) {
          setAboutData(null);
        }
      }
    };
    fetchAbout();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Ambient background waves */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">

          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

              <div className="pointer-events-none absolute -top-10 -right-10 h-52 w-52 rounded-full bg-gradient-to-bl from-orange-400/80 via-orange-300/40 to-transparent blur-xl" />

              <div
                className="pointer-events-none absolute top-4 right-6 h-24 w-32 opacity-35"
                style={{
                  backgroundImage: "radial-gradient(#94a3b8 1.5px, transparent 1.5px)",
                  backgroundSize: "12px 12px",
                }}
              />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-gradient-to-tr from-blue-500/60 via-sky-400/30 to-transparent blur-xl" />

              <div className="relative z-10 mb-4 inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/80 px-3.5 py-1 text-xs font-bold text-orange-600">
                <Target size={14} className="text-orange-600" />
                <span>{aboutData?.missionTitle || "Our Mission"}</span>
              </div>

              <h3 className="relative z-10 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl leading-[1.2] max-w-xs sm:max-w-sm">
                Democratizing Quality{" "}
                <span className="text-blue-600">Technical Education</span>

              </h3>

              <p className="relative z-10 mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-600 max-w-[260px] sm:max-w-[280px] font-normal">
                {aboutData?.missionDescription ||
                  "To provide affordable, high-quality, practical mentorship and verifiable skill development to learners across tier 1, 2, and 3 cities across India."}
              </p>

              <div className="pointer-events-none absolute right-1 sm:right-3 bottom-24 sm:bottom-28 w-32 sm:w-40 select-none z-10">
                <img
                  src={gradCapBooks}
                  alt="Education graduation cap and books"
                  className="w-full h-auto object-contain mix-blend-multiply drop-shadow-sm"
                />
              </div>

              <div className="relative z-10 mt-10 rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[#FD8006]">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {aboutData?.stat1Value || "50,000+"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {aboutData?.stat1Label || "Graduated Students"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {aboutData?.stat2Value || "120+"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {aboutData?.stat2Label || "Hiring Company Partners"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-2 sm:right-6 bg-white rounded-2xl p-3.5 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-3 z-20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80">
                <ShieldCheck size={22} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  ISO 9001:2015
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  Certified Education Platform
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100/80 px-3.5 py-1 text-xs font-bold text-blue-600">
              <Landmark size={14} className="text-blue-600" />
              <span>{aboutData?.heroBadge || "About ApnaVidya"}</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] leading-[1.18]">
              We Don&apos;t Just Teach Code,
              <br />
              <span className="relative inline-block text-[#FD8006] mt-1">
                We Build Careers
                <svg
                  className="absolute -top-3.5 -right-7 h-7 w-7 text-[#FD8006]"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path d="M12 4 L14 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M22 8 L18 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M26 18 L20 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
              {aboutData?.storyParagraph2 ||
                "ApnaVidya was founded to address this exact reality. We discarded passive rote learning in favor of high-engagement live workshops, real product development, and continuous 1-on-1 code reviews."}
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-blue-500 stroke-[2.2]" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Curriculum continuously updated for 2025 tech stack requirements.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-blue-500 stroke-[2.2]" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Direct live access to working software engineers and educators.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-blue-500 stroke-[2.2]" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Comprehensive mock interviews, resume refinement, and placement assistance.
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#FD8006] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/35 hover:-translate-y-0.5 active:scale-95"
              >
                <span>Read Our Full Story</span>
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <button
                type="button"
                onClick={() => openDemoModal()}
                className="inline-flex items-center gap-2.5 rounded-xl border border-blue-200/90 bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-xs transition-all hover:bg-blue-50/60 hover:border-blue-300 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <HeartHandshake size={18} className="text-blue-600" />
                <span>Talk to a Counselor</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
