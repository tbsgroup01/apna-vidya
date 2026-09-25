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
} from "lucide-react";
import api from "../../../services/api";

const ICON_MAP = {
  Target,
  Heart,
  ShieldCheck,
  Award,
  Compass,
  Users,
  Sparkles,
  GraduationCap,
  Eye,
};

const DEFAULT_ABOUT = {
  heroBadge: "About Apna Vidya",
  heroTitle: "Empowering the Next Generation of India's Builders",
  heroDescription:
    "Apna Vidya is an edtech platform committed to making high-impact, practical computer science and academic education accessible to every student in India.",
  storyTag: "Our Story",
  storyTitle: "Bridging the Gap Between College Degrees and Industry Careers",
  storyParagraph1:
    "Over 1.5 million engineering and computer science students graduate in India every year, yet less than 15% possess the skills required to build modern software applications.",
  storyParagraph2:
    "Apna Vidya was founded to address this exact reality. We discarded passive rote learning in favor of high-engagement live workshops, real product development, and continuous 1-on-1 code reviews.",
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
  values: [
    {
      icon: "Target",
      title: "Outcome Driven",
      desc: "We focus on what truly matters in the industry: shipping production code, building real portfolios, and cracking job interviews.",
    },
    {
      icon: "Heart",
      title: "Student-First Mentorship",
      desc: "Every student learns at their own pace. Our dedicated 1-on-1 doubt sessions ensure nobody gets left behind.",
    },
    {
      icon: "ShieldCheck",
      title: "Uncompromising Quality",
      desc: "Our curriculum is reviewed by senior engineers at top product companies to guarantee modern relevance.",
    },
    {
      icon: "Award",
      title: "Verifiable Excellence",
      desc: "Every credential earned through Apna Vidya is backed by ISO 9001:2015 standards and independent digital verification.",
    },
  ],
  teamTag: "Experienced Educators",
  teamTitle: "Meet the Mentors Behind Apna Vidya",
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
  ctaTitle: "Experience the Apna Vidya Way of Learning",
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
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
            <Compass size={14} />
            {data?.heroBadge || "About Apna Vidya"}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {data?.heroTitle || "Empowering the Next Generation of India's Builders"}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-[13px]late-300 sm:text-lg">
            {data?.heroDescription}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                {data?.storyTag || "Our Story"}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-[13px]late-900 sm:text-4xl">
                {data?.storyTitle}
              </h2>
              {data?.storyParagraph1 && (
                <p className="mt-4 text-base leading-relaxed text-[13px]late-600">
                  {data.storyParagraph1}
                </p>
              )}
              {data?.storyParagraph2 && (
                <p className="mt-3 text-base leading-relaxed text-[13px]late-600">
                  {data.storyParagraph2}
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-3xl font-black text-blue-600">
                    {data?.stat1Value || "50,000+"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[13px]late-500">
                    {data?.stat1Label || "Graduated Students"}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-black text-indigo-600">
                    {data?.stat2Value || "120+"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[13px]late-500">
                    {data?.stat2Label || "Hiring Company Partners"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Target size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[13px]late-900">
                    {data?.missionTitle || "Our Mission"}
                  </h3>
                </div>
                <p className="mt-3 text-[13px]m leading-relaxed text-[13px]late-600">
                  {data?.missionDescription}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Eye size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-[13px]late-900">
                    {data?.visionTitle || "Our Vision"}
                  </h3>
                </div>
                <p className="mt-3 text-[13px]m leading-relaxed text-[13px]late-600">
                  {data?.visionDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {valuesList.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
                {data?.valuesTag || "Our Pillars"}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[13px]late-900 sm:text-4xl">
                {data?.valuesTitle || "Values That Drive Everything We Do"}
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {valuesList.map((val, idx) => {
                const Icon = (val?.icon && ICON_MAP[val.icon]) || Target;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[13px]late-900">
                      {val.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[13px]late-500">
                      {val.desc}
                    </p>
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
              <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
                {data?.teamTag || "Experienced Educators"}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[13px]late-900 sm:text-4xl">
                {data?.teamTitle || "Meet the Mentors Behind Apna Vidya"}
              </h2>
              {data?.teamSubtitle && (
                <p className="mt-3 text-[13px]m text-[13px]late-500 sm:text-base">
                  {data.teamSubtitle}
                </p>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {teamList.map((member, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-center shadow-sm transition-all hover:shadow-lg"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-60 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-base font-bold text-[13px]late-900">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">
                      {member.role}
                    </p>
                    <p className="mt-2 text-xs text-[13px]late-500">
                      {member.credentials}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-blue-600 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            {data?.ctaTitle || "Experience the Apna Vidya Way of Learning"}
          </h2>
          {data?.ctaDescription && (
            <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100">
              {data.ctaDescription}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => openDemoModal()}
              className="rounded-xl bg-white px-8 py-3.5 text-[13px]m font-bold text-blue-600 shadow-lg hover:bg-blue-50 transition-colors cursor-pointer active:scale-95"
            >
              {data?.ctaPrimaryText || "Book a Free Demo Class"}
            </button>
            <Link
              to={data?.ctaSecondaryLink || "/courses"}
              className="rounded-xl border border-blue-400 px-8 py-3.5 text-[13px]m font-bold text-white hover:bg-blue-700 transition-colors"
            >
              {data?.ctaSecondaryText || "Explore All Courses"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;