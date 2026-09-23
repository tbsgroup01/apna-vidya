import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Download,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import api from "../../../services/api";
import { coursesData as fallbackCourses } from "../../../data/coursesData";
import { useDemoModal } from "../../../context/DemoModalContext";

const Syllabus = () => {
  const { openDemoModal } = useDemoModal();
  const [courses, setCourses] = useState(fallbackCourses);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(fallbackCourses[0].slug);
  const [syllabusList, setSyllabusList] = useState([]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [crsRes, sylRes] = await Promise.all([
          api.get("/public/courses?limit=50"),
          api.get("/public/syllabus?limit=50"),
        ]);

        if (crsRes.data?.data?.courses && crsRes.data.data.courses.length > 0) {
          const mapped = crsRes.data.data.courses.map((c, i) => {
            const fb = fallbackCourses[i % fallbackCourses.length];
            return {
              id: c.id,
              title: c.name,
              slug: c.slug,
              category: c.category?.name || "Professional Track",
              description: c.description || fb.description,
              duration: c.duration || "6 Months",
              curriculum: c.modules && c.modules.length > 0
                ? c.modules.map((m) => ({
                    module: m.title,
                    duration: m.duration || "3 Weeks",
                    topics: m.lessons && m.lessons.length > 0
                      ? m.lessons.map((l) => `${l.title} (${l.duration || "45 mins"})`)
                      : ["Key concepts and architecture", "Hands-on implementation"],
                  }))
                : fb.curriculum,
            };
          });
          setCourses(mapped);
          setSelectedCourseSlug(mapped[0].slug);
        }

        if (sylRes.data?.data?.syllabusList) {
          setSyllabusList(sylRes.data.data.syllabusList);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentCourse =
    courses.find((c) => c.slug === selectedCourseSlug) || courses[0];

  const matchingSyllabus = syllabusList.find(
    (s) => s.courseId === currentCourse.id || s.course?.name === currentCourse.title
  );

  const handleDownload = () => {
    if (matchingSyllabus?.pdf) {
      window.open(matchingSyllabus.pdf, "_blank");
    }
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <FileText size={14} />
            Academic Blueprints
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Course <span className="text-blue-600">Syllabus & Roadmaps</span>
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Explore comprehensive week-by-week lesson plans, hands-on coding
            exercises, and download official PDF curriculum guides.
          </p>
        </div>

        {downloadSuccess && (
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center text-sm font-semibold text-emerald-800 shadow-sm animate-in fade-in">
            ✓ Syllabus for &ldquo;{currentCourse.title}&rdquo; downloaded successfully!
          </div>
        )}

        <div className="mt-10 flex overflow-x-auto pb-3 gap-2 sm:justify-center no-scrollbar">
          {courses.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => setSelectedCourseSlug(course.slug)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCourseSlug === course.slug
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {currentCourse.category} • {currentCourse.duration}
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
                {currentCourse.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                {currentCourse.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                <Download size={16} />
                <span>Download PDF Syllabus</span>
              </button>
              <Link
                to={`/courses/${currentCourse.slug}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>View Full Course</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              Week-by-Week Curriculum Roadmap
            </h3>

            <div className="space-y-4">
              {currentCourse.curriculum.map((mod, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h4 className="text-base font-bold text-slate-900">
                      {mod.module}
                    </h4>
                    <span className="rounded-full bg-blue-100/70 px-3 py-1 text-xs font-semibold text-blue-700 w-fit">
                      {mod.duration}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {mod.topics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-blue-600"
                        />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold">Have Questions on the Curriculum?</h4>
              <p className="mt-1 text-xs sm:text-sm text-blue-100">
                Book a free 1-on-1 trial with a faculty mentor to test out our live teaching platform.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openDemoModal(currentCourse.title)}
              className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors w-fit shrink-0 shadow-md cursor-pointer active:scale-95"
            >
              Book a Free Demo Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
