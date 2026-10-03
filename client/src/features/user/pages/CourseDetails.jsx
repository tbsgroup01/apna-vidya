import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  BookOpen,
  Star,
  CheckCircle2,
  ChevronDown,
  Award,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Code,
  Download,
  FolderArchive,
  Layers,
  Sparkles,
  Users,
  MessageSquareQuote,
} from "lucide-react";
import api from "../../../services/api";
import { coursesData } from "../../../data/coursesData";
import { useDemoModal } from "../../../context/DemoModalContext";
import { useBreadcrumb } from "../components/Breadcrumb";

const CourseDetails = () => {
  const { openDemoModal } = useDemoModal();
  const { setCustomTitle } = useBreadcrumb();
  const { slug } = useParams();

  const fallback = coursesData.find((c) => c.slug === slug) || coursesData[0];
  const [course, setCourse] = useState({ ...fallback, syllabusUrl: "" });
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (course?.name || course?.title) {
      setCustomTitle(course.name || course.title);
    }
  }, [course?.name, course?.title, setCustomTitle]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/courses/${slug}`);
        if (res.data?.data?.course) {
          const c = res.data.data.course;

          const parsedOutcomes = Array.isArray(c.learningOutcomes)
            ? c.learningOutcomes
            : typeof c.learningOutcomes === "string" && c.learningOutcomes.startsWith("[")
              ? JSON.parse(c.learningOutcomes || "[]")
              : fallback.features || [
                "Industry-standard project portfolio",
                "1-on-1 weekly code review sessions",
                "Live interactive query resolution",
                "Official ISO certification upon completion",
              ];

          const parsedFaqs = Array.isArray(c.faqs)
            ? c.faqs
            : typeof c.faqs === "string" && c.faqs.startsWith("[")
              ? JSON.parse(c.faqs || "[]")
              : [
                {
                  question: "Is this course suitable for complete beginners?",
                  answer: "Yes, our modules start from fundamental core principles before transitioning into advanced industry-grade architectural patterns and project building.",
                },
                {
                  question: "Will I receive an accredited certification upon completion?",
                  answer: "Yes, once you complete the capstone projects and pass the final evaluation, an official ISO-certified verifiable credentials certificate is issued.",
                },
                {
                  question: "What if I miss a live interactive class?",
                  answer: "All live sessions are recorded in high-definition and uploaded to your student LMS dashboard within 2 hours with lifetime revision access.",
                },
                {
                  question: "How does the daily live doubt resolution work?",
                  answer: "You have access to dedicated daily live doubt-clearing sessions where experienced teaching assistants solve queries 1-on-1 via screen-sharing.",
                },
              ];

          const mappedModules = c.modules && c.modules.length > 0
            ? c.modules.map((m) => ({
              id: m.id,
              title: m.title,
              duration: m.duration || "3 Weeks",
              lessons: m.lessons && m.lessons.length > 0
                ? m.lessons
                : [
                  { id: 1, title: "Core lecture and architectural breakdown", duration: "60 mins" },
                  { id: 2, title: "Guided hands-on project implementation", duration: "90 mins" },
                ],
              materials: m.materials || [],
            }))
            : fallback.curriculum?.map((m, i) => ({
              id: i + 1,
              title: m.module,
              duration: m.duration || "3 Weeks",
              lessons: (m.topics || []).map((t, ti) => ({ id: ti + 1, title: t, duration: "45 mins" })),
              materials: [],
            })) || [];

          const feesNum = Number(c.fees || 29999);
          const strikePriceNum = Number(c.strikePrice || Math.round(feesNum * 1.5));
          const discountPct = strikePriceNum > feesNum
            ? Math.round(((strikePriceNum - feesNum) / strikePriceNum) * 100)
            : 35;

          setCourse({
            id: c.id,
            title: c.name,
            slug: c.slug,
            badge: c.badge || (c.featured ? "Bestseller" : "Popular"),
            category: c.category?.name || "Professional Track",
            description: c.description || fallback.description,
            fullOverview: c.fullOverview || "",
            duration: c.duration || "6 Months",
            level: c.level || "Beginner to Advanced",
            rating: "4.9",
            studentsCount: "1,450+",
            price: `₹${feesNum.toLocaleString()}`,
            originalPrice: `₹${strikePriceNum.toLocaleString()}`,
            discountPct,
            image: c.image || fallback.image,
            learningOutcomes: parsedOutcomes.length > 0 ? parsedOutcomes : fallback.features,
            classFormat: c.classFormat || "100% Live Online",
            batchTiming: c.batchTiming || "Weekday & Weekend Options",
            lmsAccess: c.lmsAccess || "Lifetime Revision Access",
            doubtResolution: c.doubtResolution || "Daily Live 1-on-1 Windows",
            prerequisites: c.prerequisites || fallback.prerequisites || "Basic computer skills and passion for technology.",
            certificateInfo: c.certificateInfo || fallback.certificate || "ApnaVidya Certified Industry Credentials with Verifiable ID.",
            targetAudience: c.targetAudience || "College graduates, junior developers, and professionals seeking career transitions.",
            modules: mappedModules,
            faqs: parsedFaqs,
            syllabusUrl: c.syllabusUrl || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-6 text-white sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FD8006]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl" />
          <div className="max-w-3xl relative">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-500/20">
                {course.category} • {course.level}
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold">
                {course.badge}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">

              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-slate-400" />
                <span>{course.duration}</span>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-5">
                <Sparkles size={22} className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  What You Will Learn & Build
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {course.learningOutcomes && course.learningOutcomes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* {course.fullOverview && (
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 mb-5">
                  <BookOpen size={22} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Comprehensive Course Overview
                  </h2>
                </div>
                <div
                  className="rich-text-content prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.fullOverview }}
                />
              </div>
            )} */}

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Prerequisites, Audience & Certification
              </h2>
              <div className="space-y-5 text-sm text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Recommended Prerequisites</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {course.prerequisites}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Who This Program Is Designed For</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {course.targetAudience}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      Verified ISO Credential Certificate Included
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {course.certificateInfo}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {course.faqs && course.faqs.length > 0 && (
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquareQuote size={22} className="text-blue-600" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-3">
                  {course.faqs.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-slate-50 cursor-pointer"
                        >
                          <span className="text-sm font-bold text-slate-900 pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            size={18}
                            className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-blue-600" : ""
                              }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50">
              <div className="overflow-hidden rounded-2xl relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-44 w-full object-cover"
                />
                <span className="absolute top-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                  {course.level}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">
                  {course.price}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  {course.originalPrice}
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  Save {course.discountPct || 35}%
                </span>
              </div>

              <div className="mt-6 space-y-3">



                <Link
                  to="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-[#FD8006] text-white py-3 text-sm font-semibold  hover:bg-slate-50 hover:text-slate-700  transition-colors"
                >
                  <span>Talk to Academic Advisor</span>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    openDemoModal(course.title, {
                      mode: "syllabus",
                      syllabusUrl: course.syllabusUrl,
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/70 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Download size={18} />
                  <span>Download Syllabus</span>
                </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6 space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Class Format</span>
                  <span className="font-bold text-slate-900">{course.classFormat}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Batch Timing</span>
                  <span className="font-bold text-slate-900">{course.batchTiming}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">LMS Access</span>
                  <span className="font-bold text-slate-900">{course.lmsAccess}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Doubt Resolution</span>
                  <span className="font-bold text-emerald-600">{course.doubtResolution}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
