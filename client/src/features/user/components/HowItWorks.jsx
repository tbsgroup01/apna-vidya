import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Video, Code2, Award, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: BookOpen,
    title: "Choose Your Learning Path",
    description:
      "Select from Full Stack, Web Dev, Programming, or School Academics based on your personal goals.",
  },
  {
    step: "02",
    icon: Video,
    title: "Attend Live Mentor Classes",
    description:
      "Join interactive live classes, ask questions in real-time, and get daily doubt clearing support.",
  },
  {
    step: "03",
    icon: Code2,
    title: "Build Real-World Projects",
    description:
      "Apply your knowledge on hands-on assignments and production-grade applications that recruiters value.",
  },
  {
    step: "04",
    icon: Award,
    title: "Get Certified & Placed",
    description:
      "Earn your ISO-verified certificate, polish your resume, and prepare for interviews with our placement cell.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 text-white sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
            Simple 4-Step Process
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            How Apna Vidya{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Transforms Your Career
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            From your very first lesson to receiving your job offer letter, our
            structured roadmap keeps you focused and motivated.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-800 bg-slate-950/60 p-6 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/40 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-700 transition-colors group-hover:text-blue-400">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/syllabus"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700"
          >
            <span>Explore Complete Curriculum Roadmaps</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
