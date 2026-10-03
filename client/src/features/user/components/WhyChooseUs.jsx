import React from "react";
import { useDemoModal } from "../../../context/DemoModalContext";
import {
  Video,
  UserCheck,
  Briefcase,
  Award,
  Layers,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live Interactive Classes",
    description:
      "Learn in real-time with top subject-matter mentors. Ask doubts instantly with voice and chat during every live session.",
    badge: "Interactive",
  },
  {
    icon: UserCheck,
    title: "1-on-1 Personal Mentorship",
    description:
      "Dedicated mentors to review your code, guide your study schedule, and give personalized feedback on every assignment.",
    badge: "Dedicated",
  },
  {
    icon: Briefcase,
    title: "Industry Capstone Projects",
    description:
      "Work on enterprise-level projects simulating actual engineering teams. Build a portfolio that commands recruiter attention.",
    badge: "Portfolio Ready",
  },
  {
    icon: Award,
    title: "ISO Verified Certifications",
    description:
      "Earn industry-recognized, verifiable digital credentials with tamper-proof QR verification codes.",
    badge: "Recognized",
  },
  {
    icon: Layers,
    title: "Structured Curriculum",
    description:
      "Every course roadmap is designed alongside tech leads and university professors to match 2025 hiring standards.",
    badge: "Up-to-Date",
  },
  {
    icon: Clock,
    title: "Lifetime LMS & Notes Access",
    description:
      "Revisit recorded live lectures, chapter notes, cheat sheets, and code repositories anytime, anywhere on your schedule.",
    badge: "Lifetime Access",
  },
];

const WhyChooseUs = () => {
  const { openDemoModal } = useDemoModal();

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      {/* Background Decor: Side Dot Grids and Corner Waves */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Left Orange Dotted Grid */}
        <div
          className="absolute left-4 sm:left-10 top-1/4 h-28 w-28 opacity-40 hidden sm:block"
          style={{
            backgroundImage: "radial-gradient(#f97316 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* Left Bottom Flowing Gradient Curves */}
        <div className="absolute -bottom-14 -left-14 h-80 w-80 rounded-full bg-gradient-to-tr from-orange-300/40 via-amber-200/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-300/30 via-blue-200/10 to-transparent blur-3xl" />

        {/* Right Blue Dotted Grid */}
        <div
          className="absolute right-4 sm:right-10 bottom-1/4 h-28 w-28 opacity-40 hidden sm:block"
          style={{
            backgroundImage: "radial-gradient(#3b82f6 1.8px, transparent 1.8px)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* Right Bottom Flowing Gradient Curves */}
        <div className="absolute -bottom-14 -right-14 h-80 w-80 rounded-full bg-gradient-to-tl from-blue-400/40 via-sky-300/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-gradient-to-tl from-orange-300/20 via-amber-200/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-bold text-blue-600">
            <Users size={14} className="text-blue-600" />
            <span>WHY CHOOSE US</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[40px] leading-tight">
            Why Thousands of Learners{" "}
            <span className="relative inline-block text-blue-600">
              Choose{" "}
              <span className="text-[#FD8006]">
                Us
                {/* 2 orange burst rays */}
                <svg
                  className="absolute -top-3.5 -right-6 h-6 w-6 text-[#FD8006]"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path d="M10 6 L14 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M22 10 L18 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              {/* Curved orange underline swoosh */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-2.5 text-[#FD8006]"
                viewBox="0 0 140 12"
                fill="none"
              >
                <path
                  d="M4 6 C40 11, 100 11, 136 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-500 max-w-2xl mx-auto font-normal">
            We combine high-touch live mentorship, practical real-world
            curriculum, and outcome-oriented placement support to give you the
            best learning experience.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isOrangeTheme = idx % 2 === 1;

            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-slate-100 bg-white p-7 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50 overflow-hidden"
              >
                {/* Alternating soft corner gradient wave */}
                {isOrangeTheme ? (
                  <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-tl from-orange-400/35 via-amber-300/15 to-transparent blur-xl transition-transform duration-300 group-hover:scale-125" />
                ) : (
                  <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-tl from-blue-400/35 via-sky-300/15 to-transparent blur-xl transition-transform duration-300 group-hover:scale-125" />
                )}

                {/* Top Row: Icon Container + Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                      isOrangeTheme
                        ? "bg-orange-50 text-[#FD8006] group-hover:bg-[#FD8006] group-hover:text-white"
                        : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                    } shadow-2xs`}
                  >
                    <Icon size={24} strokeWidth={2} />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isOrangeTheme
                        ? "bg-orange-50/90 text-[#FD8006] border border-orange-100/70"
                        : "bg-blue-50/90 text-blue-600 border border-blue-100/70"
                    }`}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="relative z-10 mt-5 text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative z-10 mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => openDemoModal()}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FD8006] to-[#f97316] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <span>Experience It In A Free Demo Class</span>
            <ArrowRight
              size={17}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
