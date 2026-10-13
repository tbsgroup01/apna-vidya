import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { useDemoModal } from "../../../context/DemoModalContext";

const FinalCTA = () => {
  const { openDemoModal } = useDemoModal();
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
          <Sparkles size={14} />
          Start Your Transformation Today
        </div>

        <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl lg:text-4xl">
          Ready to Build Your Future with{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            APNAVIDYA?
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[13px]late-400 sm:text-lg">
          Join over 50,000 students mastering practical coding skills, building
          real-world projects, and receiving career placement mentorship.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => openDemoModal()}
            className="group flex items-center gap-2 rounded-xl bg-[#FD8006] px-8 py-4 text-[13px]m font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/40 active:scale-95 sm:text-base cursor-pointer"
          >
            <PlayCircle size={18} />
            <span>Book a Free Demo Class</span>
          </button>

          <Link
            to="/courses"
            className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-8 py-4 text-[13px]m font-semibold text-[13px]late-200 transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-white sm:text-base"
          >
            <span>Explore All Courses</span>
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <p className="mt-6 text-xs text-[13px]late-500">
          No credit card required • Instant confirmation • 100% free trial
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
