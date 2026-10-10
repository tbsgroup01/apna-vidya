import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDemoModal } from "../../../context/DemoModalContext";
import {
  Compass,
  Target,
  Eye,
  Heart,
  Award,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GraduationCap,
  BookOpen,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import api from "../../../services/api";

const StudentFirstPillarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">

    <line x1="10" y1="4" x2="11" y2="7" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="16" y1="2.5" x2="16" y2="6" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="22" y1="4" x2="21" y2="7" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" />

    <path
      d="M15 10.5 C 11.5 9.4, 6.2 10.2, 4.3 11.2 C 4.1 11.3, 4 11.6, 4 12 L 4 23.5 C 4 24.1, 4.6 24.6, 5.2 24.4 C 7.2 23.7, 11.4 23, 15 24 Z"
      fill="#3B82F6"
    />
    <path
      d="M17 10.5 C 20.5 9.4, 25.8 10.2, 27.7 11.2 C 27.9 11.3, 28 11.6, 28 12 L 28 23.5 C 28 24.1, 27.4 24.6, 26.8 24.4 C 24.8 23.7, 20.6 23, 17 24 Z"
      fill="#2563EB"
    />
    <line x1="16" y1="10.5" x2="16" y2="24" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ContinuousLearningPillarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 4 C 10.8 4, 6.8 8.2, 6.8 13.5 C 6.8 16.8, 8.4 19.6, 11 21.3 L 11 23.5 C 11 24.3, 11.7 25, 12.5 25 L 19.5 25 C 20.3 25, 21 24.3, 21 23.5 L 21 21.3 C 23.6 19.6, 25.2 16.8, 25.2 13.5 C 25.2 8.2, 21.2 4, 16 4 Z"
      fill="#F97316"
    />
    <path d="M12.5 27.5 L 19.5 27.5" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M13.5 29.8 L 18.5 29.8" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IntegrityTrustPillarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">

    <circle cx="9" cy="11.5" r="3.2" fill="#34D399" />
    <path d="M3.5 22.5 C 3.5 19.2, 6.5 17, 10.5 17 C 11.7 17, 12.7 17.3, 13.6 17.8 C 12.8 19.1, 12.4 20.7, 12.4 22.5 Z" fill="#34D399" />

    <circle cx="23" cy="11.5" r="3.2" fill="#34D399" />
    <path d="M28.5 22.5 C 28.5 19.2, 25.5 17, 21.5 17 C 20.3 17, 19.3 17.3, 18.4 17.8 C 19.2 19.1, 19.6 20.7, 19.6 22.5 Z" fill="#34D399" />

    <circle cx="16" cy="9.5" r="4.2" fill="#10B981" />
    <path d="M8.5 23.5 C 8.5 19.2, 11.8 16.5, 16 16.5 C 20.2 16.5, 23.5 19.2, 23.5 23.5 Z" fill="#10B981" />
  </svg>
);

const InnovationImpactPillarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none">

    <rect x="5.5" y="18" width="4.5" height="9" rx="1.5" fill="#C084FC" />
    <rect x="12" y="13" width="4.5" height="14" rx="1.5" fill="#A855F7" />
    <rect x="18.5" y="8" width="4.5" height="19" rx="1.5" fill="#7E22CE" />

    <path d="M7 13 L 20 4 M 13.5 3.5 L 20.5 3.5 L 20.5 10.5" stroke="#7E22CE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ICON_MAP = {
  BookOpen: StudentFirstPillarIcon,
  Lightbulb: ContinuousLearningPillarIcon,
  Users: IntegrityTrustPillarIcon,
  TrendingUp: InnovationImpactPillarIcon,
  Target,
  Heart,
  ShieldCheck,
  Award,
  Compass,
  Sparkles,
  GraduationCap,
  Eye,
};

const CARD_THEMES = [
  {
    iconBg: "bg-[#EBF3FE]",
    iconColor: "text-blue-600",
    iconBorder: "border-blue-100/80",
    barColor: "bg-blue-600",
    blobBg: "bg-blue-100/50",
  },
  {
    iconBg: "bg-[#FFF4E5]",
    iconColor: "text-amber-500",
    iconBorder: "border-amber-100/80",
    barColor: "bg-[#F59E0B]",
    blobBg: "bg-[#FFF5E8]",
  },
  {
    iconBg: "bg-[#EAF8F0]",
    iconColor: "text-emerald-600",
    iconBorder: "border-emerald-100/80",
    barColor: "bg-[#10B981]",
    blobBg: "bg-[#EBF9F1]",
  },
  {
    iconBg: "bg-[#F5EEFD]",
    iconColor: "text-purple-600",
    iconBorder: "border-purple-100/80",
    barColor: "bg-[#8B5CF6]",
    blobBg: "bg-[#F6EFFE]",
  },
];

const DEFAULT_ABOUT = {
  heroBadge: "About APNAVIDYA",
  heroTitle: "Empowering the Next Generation of India's Builders",
  heroDescription:
    "APNAVIDYA is an edtech platform committed to making high-impact, practical computer science and academic education accessible to every student in India.",
  storyTag: "Our Story",
  storyTitle: "Bridging the Gap Between College Degrees and Industry Careers",
  storyParagraph1:
    "Over 1.5 million engineering and computer science students graduate in India every year, yet less than 15% possess the skills required to build modern software applications.",
  storyParagraph2:
    "APNAVIDYA was founded to address this exact reality. We discarded passive rote learning in favor of high-engagement live workshops, real product development, and continuous 1-on-1 code reviews.",
  stat1Value: "50,000+",
  stat1Label: "Graduated Students",
  stat2Value: "120+",
  stat2Label: "Hiring Company Partners",
  missionTitle: "Our Mission",
  missionDescription:
    "To provide affordable, high-quality, practical mentorship and verifiable skill development to learners across tier 1, 2, and 3 cities across India.",
  visionTitle: "Our Vision",
  visionDescription:
    "To become India's most student-centric learning community where anybody with grit and curiosity can transition into a thriving software engineering career.",
  valuesTag: "Our Pillars",
  valuesTitle: "Values That Drive Everything We Do",
  valuesSubtitle:
    "These core values guide our mission, shape our culture, and inspire us to create a better learning experience for every student.",
  values: [
    {
      icon: "BookOpen",
      title: "Student First",
      desc: "We put students at the center of everything we do, focusing on their growth, confidence and success.",
    },
    {
      icon: "Lightbulb",
      title: "Continuous Learning",
      desc: "We believe in lifelong learning, constantly evolving to deliver better solutions and stay ahead.",
    },
    {
      icon: "Users",
      title: "Integrity & Trust",
      desc: "We build honest relationships and maintain transparency in all our actions.",
    },
    {
      icon: "TrendingUp",
      title: "Innovation for Impact",
      desc: "We embrace new ideas and technology to create meaningful change in education.",
    },
  ],
  teamTag: "Experienced Educators",
  teamTitle: "Meet the Mentors Behind APNAVIDYA",
  teamSubtitle:
    "Learn from engineers who have shipped software at scale and trained thousands of successful graduates.",
  team: [
    {
      name: "Dr. Sandeep Nair",
      role: "Founder & Academic Director",
      credentials: "Ex-Professor IIT, 18+ Years Experience",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Amit Verma",
      role: "Head of Engineering & Full Stack Lead",
      credentials: "Ex-Senior Staff Engineer, Tech Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Pooja Sharma",
      role: "Head of Career & Corporate Placements",
      credentials: "12+ Years Corporate HR & Talent Acquisition",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Rajesh Mehrotra",
      role: "Lead Mobile & Systems Architect",
      credentials: "Built applications with 10M+ Play Store downloads",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
  ],
  ctaTitle: "Experience the APNAVIDYA Way of Learning",
  ctaDescription:
    "Join a live session, speak with our instructors, and explore how our curriculum can help you achieve your career aspirations.",
  ctaPrimaryText: "Book a Free Demo Class",
  ctaSecondaryText: "Explore All Courses",
  ctaSecondaryLink: "/courses",
};

const About = () => {
  const { openDemoModal } = useDemoModal();
  const [data, setData] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      try {
        const res = await api.get("/public/about");
        if (isMounted && res.data?.data?.about) {
          const incoming = res.data.data.about;
          let values = incoming.values;
          if (typeof values === "string") {
            try {
              values = JSON.parse(values);
            } catch {
              values = DEFAULT_ABOUT.values;
            }
          }
          if (!Array.isArray(values)) values = DEFAULT_ABOUT.values;

          let team = incoming.team;
          if (typeof team === "string") {
            try {
              team = JSON.parse(team);
            } catch {
              team = DEFAULT_ABOUT.team;
            }
          }
          if (!Array.isArray(team)) team = DEFAULT_ABOUT.team;

          setData({ ...incoming, values, team });
        }
      } catch {
        if (isMounted) {
          setData(DEFAULT_ABOUT);
        }
      }
    };
    fetchContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const valuesList = useMemo(() => {
    if (Array.isArray(data?.values)) return data.values;
    if (typeof data?.values === "string") {
      try {
        const parsed = JSON.parse(data.values);
        if (Array.isArray(parsed)) return parsed;
      } catch { }
    }
    return DEFAULT_ABOUT.values;
  }, [data?.values]);

  const teamList = useMemo(() => {
    if (Array.isArray(data?.team)) return data.team;
    if (typeof data?.team === "string") {
      try {
        const parsed = JSON.parse(data.team);
        if (Array.isArray(parsed)) return parsed;
      } catch { }
    }
    return DEFAULT_ABOUT.team;
  }, [data?.team]);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white sm:py-28">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#FD8006]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
            <Compass size={14} />
            {data?.heroBadge || "About APNAVIDYA"}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-4xl">
            {data?.heroTitle || "Empowering the Next Generation of India's Builders"}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {data?.heroDescription}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                {data?.storyTag || "Our Story"}
              </span>
              <h2 className="mt-3 font-extrabold text-slate-900 ">
                {data?.storyTitle}
              </h2>
              {data?.storyParagraph1 && (
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {data.storyParagraph1}
                </p>
              )}
              {data?.storyParagraph2 && (
                <p className="mt-3 text-base leading-relaxed text-slate-600">
                  {data.storyParagraph2}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-3xl font-black text-blue-600">
                    {data?.stat1Value || "50,000+"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {data?.stat1Label || "Graduated Students"}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black text-indigo-600">
                    {data?.stat2Value || "120+"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {data?.stat2Label || "Hiring Company Partners"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FD8006] text-white">
                    <Target size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {data?.missionTitle || "Our Mission"}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {data?.missionDescription}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Eye size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {data?.visionTitle || "Our Vision"}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {data?.visionDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {valuesList.length > 0 && (
        <section className="relative overflow-hidden bg-[#FAFCFF] py-20 sm:py-24 border-y border-slate-100">

          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">

            <div className="absolute left-6 sm:left-12 top-10 sm:top-14 select-none hidden lg:block opacity-80">
              <svg width="64" height="96" viewBox="0 0 64 96" fill="none">
                {[0, 1, 2, 3].map((col) =>
                  [0, 1, 2, 3, 4, 5].map((row) => (
                    <circle
                      key={`${col}-${row}`}
                      cx={col * 18 + 5}
                      cy={row * 16 + 5}
                      r="2.2"
                      fill="#BFDBFE"
                    />
                  ))
                )}
              </svg>
            </div>

            <div className="absolute right-4 sm:right-10 lg:right-16 top-6 sm:top-8 select-none hidden md:block">
              <svg className="w-64 sm:w-80 h-40 sm:h-48 overflow-visible" viewBox="0 0 280 160" fill="none">

                <path
                  d="M 20 135 C 50 80, 110 50, 150 90 C 180 120, 215 90, 260 25"
                  stroke="#93C5FD"
                  strokeWidth="2.2"
                  strokeDasharray="4 6"
                  strokeLinecap="round"
                />
                <g transform="translate(252, 12) rotate(24)">
                  <polygon points="0,26 36,0 14,34 11,22" fill="#3B82F6" />
                  <polygon points="11,22 36,0 24,9" fill="#60A5FA" />
                  <polygon points="11,22 14,34 8,19" fill="#2563EB" />
                </g>
              </svg>
            </div>

            <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-100/35 blur-3xl pointer-events-none" />
            <div className="absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="flex items-center justify-center gap-3">
              <span className="h-[2px] w-8 sm:w-12 bg-blue-200/90 rounded-full" />
              <span className="rounded-full bg-blue-50/90 border border-blue-100/90 px-4 py-1 text-xs sm:text-sm font-semibold text-blue-600 shadow-2xs">
                {data?.valuesTag || "Our Pillars"}
              </span>
              <span className="h-[2px] w-8 sm:w-12 bg-blue-200/90 rounded-full" />
            </div>

            <div className="mx-auto mt-4 max-w-3xl text-center">
              <div className="relative inline-block px-7 sm:px-11">

                <svg
                  className="absolute -top-3.5 -left-1 sm:-left-2 w-7 h-7 text-blue-500"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <line x1="8" y1="22" x2="3" y2="12" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="18" y1="18" x2="13" y2="7" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
                </svg>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px] leading-tight">
                  {data?.valuesTitle || "Values That Drive Everything We Do"}
                </h2>

                <svg
                  className="absolute -top-3.5 -right-1 sm:-right-2 w-7 h-7 text-blue-500"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <line x1="20" y1="22" x2="25" y2="12" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="10" y1="18" x2="15" y2="7" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>

              <p className="mx-auto mt-4 max-w-2xl text-center text-sm sm:text-base leading-relaxed text-slate-500 font-normal">
                {data?.valuesSubtitle ||
                  "These core values guide our mission, shape our culture, and inspire us to create a better learning experience for every student."}
              </p>
            </div>

            <div className="mt-12 sm:mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {valuesList.map((val, idx) => {
                const Icon = (val?.icon && ICON_MAP[val.icon]) || ICON_MAP.BookOpen;
                const theme = CARD_THEMES[idx % CARD_THEMES.length];
                return (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 sm:p-8 shadow-[0_8px_30px_rgba(219,234,254,0.25)] hover:shadow-[0_20px_45px_rgba(30,58,138,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >

                    <div
                      className={`pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full ${theme.blobBg} transition-transform duration-500 group-hover:scale-125`}
                    />

                    <div>
                      <div
                        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor} ${theme.iconBorder} border shadow-xs transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon className="w-7 h-7" size={26} strokeWidth={2.2} />
                      </div>

                      <h3 className="relative mt-6 text-xl font-bold text-slate-900 tracking-tight">
                        {val.title}
                      </h3>

                      <div
                        className={`relative mt-2.5 mb-4 h-1 w-8 rounded-full ${theme.barColor}`}
                      />

                      <p className="relative text-sm leading-relaxed text-slate-500 font-normal">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {teamList.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-[1.5px] w-8 sm:w-12 bg-blue-200/90 rounded-full" />
                <span className="rounded-full bg-blue-50/90 border border-blue-100/90 px-4 py-1 text-xs sm:text-sm font-semibold text-blue-600 shadow-2xs">
                  {data?.teamTag || "Experienced Educators"}
                </span>
                <span className="h-[1.5px] w-8 sm:w-12 bg-blue-200/90 rounded-full" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {data?.teamTitle || "Meet the Mentors Behind APNAVIDYA"}
              </h2>
              {data?.teamSubtitle && (
                <p className="mt-3 text-sm text-slate-500 sm:text-base">
                  {data.teamSubtitle}
                </p>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamList.map((member, idx) => (
                <div
                  key={idx}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-center shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="h-auto md:h-80 w-full overflow-hidden bg-slate-100 " >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-top transition-transform duration-300 group-hover:scale-105"
                      style={{ objectPosition: "top center" }}
                    />
                  </div>
                  <div className="relative h-auto p-5 bg-[#029EFB] text-center text-white border-t border-blue-100/90">
                    <h3 className="text-base font-bold ">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold mt-0.5">
                      {member.role}
                    </p>
                    <p className="mt-2 text-xs ">
                      {member.credentials}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-[#070D1E] py-20 text-white sm:py-24 border-t border-slate-800/60">

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[650px] rounded-full bg-blue-600/15 blur-[110px]" />
          <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-[90px]" />
          <div className="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            {data?.ctaTitle || "Experience the APNAVIDYA Way of Learning"}
          </h2>
          {data?.ctaDescription && (
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 leading-relaxed">
              {data.ctaDescription}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => openDemoModal()}
              className="rounded-xl bg-[#FD8006] hover:bg-[#ea7300] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
            >
              <span>{data?.ctaPrimaryText || "Book a Free Demo Class"}</span>
              <ArrowRight size={16} />
            </button>
            <Link
              to={data?.ctaSecondaryLink || "/courses"}
              className="rounded-xl border border-slate-700/90 bg-slate-800/50 hover:bg-slate-800 px-8 py-3.5 text-sm font-bold text-slate-200 hover:text-white transition-all inline-flex items-center gap-2"
            >
              <span>{data?.ctaSecondaryText || "Explore All Courses"}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;