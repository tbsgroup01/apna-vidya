import React from "react";
import { useDemoModal } from "../../../context/DemoModalContext";
import {
  Video,
  UserCheck,
  Briefcase,
  Award,
  Layers,
  Clock,
  Sparkles,
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
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600">
            <Sparkles size={14} />
            The Apna Vidya Advantage
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[13px]late-900 sm:text-4xl">
            Why Thousands of Learners{" "}
            <span className="text-blue-600">Choose Us</span>
          </h2>
          <p className="mt-3 text-base text-[13px]late-600">
            We combine high-touch live mentorship, practical real-world
            curriculum, and outcome-oriented placement support to give you the
            best learning experience.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[13px] font-semibold text-[13px]late-600 group-hover:bg-blue-50 group-hover:text-blue-600">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-[13px]late-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[13px]m leading-relaxed text-[13px]late-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => openDemoModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-[13px]m font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35 cursor-pointer active:scale-95"
          >
            <span>Experience It In A Free Demo Class</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
