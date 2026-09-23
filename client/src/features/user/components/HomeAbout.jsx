import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import api from "../../../services/api";

const HomeAbout = () => {
  const [aboutData, setAboutData] = useState(null);

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
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 p-8 text-white shadow-2xl shadow-blue-600/25 sm:p-10">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs">
                    {aboutData?.missionTitle || "Our Mission"}
                  </span>
                  <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                    Democratizing Quality Technical Education Across India
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-blue-100">
                    {aboutData?.missionDescription ||
                      "Apna Vidya was founded on a simple principle: every student, regardless of their city or background, deserves access to world-class teachers, real engineering projects, and practical career guidance."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                  <div>
                    <p className="text-2xl font-black">
                      {aboutData?.stat1Value || "100%"}
                    </p>
                    <p className="text-xs text-blue-200">
                      {aboutData?.stat1Label || "Live Mentorship"}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-black">
                      {aboutData?.stat2Value || "24x7"}
                    </p>
                    <p className="text-xs text-blue-200">
                      {aboutData?.stat2Label || "Community Support"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-2 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex sm:items-center sm:gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">ISO 9001:2015</p>
                <p className="text-xs text-slate-500">Certified Education Platform</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              <Compass size={14} />
              {aboutData?.heroBadge || "About Apna Vidya"}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              We Don&apos;t Just Teach Code, We{" "}
              <span className="text-blue-600">Build Careers</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              {aboutData?.storyParagraph2 ||
                "Traditional classrooms focus on rote memorization. At Apna Vidya, we bridge the gap between theoretical textbooks and modern tech industry demands with hands-on labs, live code walkthroughs, and mentor-reviewed capstone projects."}
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Curriculum continuously updated for 2025 tech stack requirements.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Direct live access to working software engineers and educators.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700">
                  Comprehensive mock interviews, resume refinement, and placement assistance.
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
              >
                <span>Read Our Full Story</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <HeartHandshake size={18} className="text-blue-600" />
                <span>Talk to a Counselor</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
