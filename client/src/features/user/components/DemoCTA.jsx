import React from "react";
import { PlayCircle, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { useDemoModal } from "../../../context/DemoModalContext";

const DemoCTA = () => {
  const { openDemoModal } = useDemoModal();

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 px-6 py-12 text-white shadow-2xl shadow-blue-600/30 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs">
              <PlayCircle size={15} />
              100% Free Live Trial Session
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-3xl">
              Experience ApnaVidya Live Before Enrolling
            </h2>
            <p className="mt-3 text-[13px]m leading-relaxed text-blue-100 sm:text-base">
              Attend a live class, interact with senior educators, experience
              our interactive coding platform, and get all your career doubts
              answered with no financial commitment.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-blue-100 sm:text-[13px]m">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-amber-300" />
                <span>Zero Cost Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-300" />
                <span>60-Minute Interactive Session</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-300" />
                <span>No Credit Card Needed</span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 shrink-0 lg:mt-0">
            <button
              type="button"
              onClick={() => openDemoModal()}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-xl shadow-slate-950/20 transition-all hover:bg-blue-50 active:scale-95 cursor-pointer"
            >
              <PlayCircle size={20} className="text-blue-600" />
              <span>Book Your Free Slot</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoCTA;
