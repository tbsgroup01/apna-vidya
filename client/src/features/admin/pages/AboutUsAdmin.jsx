import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Save,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Compass,
  Target,
  Heart,
  Award,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Layers,
  GraduationCap,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { FormInput, FormTextarea, ImageUploadPreview } from "../components/FormControls";
import api from "../../../services/api";

const ICON_OPTIONS = [
  { label: "Target (Outcome)", value: "Target" },
  { label: "Heart (Empathy)", value: "Heart" },
  { label: "Shield Check (Quality)", value: "ShieldCheck" },
  { label: "Award (Excellence)", value: "Award" },
  { label: "Compass (Direction)", value: "Compass" },
  { label: "Users (Community)", value: "Users" },
  { label: "Sparkles (Innovation)", value: "Sparkles" },
  { label: "Graduation Cap (Academic)", value: "GraduationCap" },
];

const MENTOR_PRESET_IMAGES = [
  {
    label: "Director Portrait",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Tech Lead Portrait",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Corporate Head",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Systems Architect",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Female Instructor",
    url: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Male Instructor",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
  },
];

const INITIAL_FORM = {
  heroBadge: "About ApnaVidya",
  heroTitle: "Empowering the Next Generation of India's Builders",
  heroDescription:
    "ApnaVidya is an edtech platform committed to making high-impact, practical computer science and academic education accessible to every student in India.",
  storyTag: "Our Story",
  storyTitle: "Bridging the Gap Between College Degrees and Industry Careers",
  storyParagraph1:
    "Over 1.5 million engineering and computer science students graduate in India every year, yet less than 15% possess the skills required to build modern software applications.",
  storyParagraph2:
    "ApnaVidya was founded to address this exact reality. We discarded passive rote learning in favor of high-engagement live workshops, real product development, and continuous 1-on-1 code reviews.",
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
      desc: "Every credential earned through ApnaVidya is backed by ISO 9001:2015 standards and independent digital verification.",
    },
  ],
  teamTag: "Experienced Educators",
  teamTitle: "Meet the Mentors Behind ApnaVidya",
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
  ctaTitle: "Experience the ApnaVidya Way of Learning",
  ctaDescription:
    "Join a live session, speak with our instructors, and explore how our curriculum can help you achieve your career aspirations.",
  ctaPrimaryText: "Book a Free Demo Class",
  ctaSecondaryText: "Explore All Courses",
  ctaSecondaryLink: "/courses",
};

const TABS = [
  { id: "hero", label: "Hero Banner", icon: Building2 },
  { id: "story", label: "Our Story & Stats", icon: Compass },
  { id: "mission", label: "Mission & Vision", icon: Target },
  { id: "values", label: "Core Values", icon: Layers },
  { id: "team", label: "Mentors & Team", icon: Users },
  { id: "cta", label: "Bottom CTA Banner", icon: ArrowRight },
];

const AboutUsAdmin = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/about");
      const incoming = res.data?.data?.about;
      if (incoming) {
        let values = incoming.values;
        if (typeof values === "string") {
          try {
            values = JSON.parse(values);
          } catch {
            values = INITIAL_FORM.values;
          }
        }
        if (!Array.isArray(values)) values = INITIAL_FORM.values;

        let team = incoming.team;
        if (typeof team === "string") {
          try {
            team = JSON.parse(team);
          } catch {
            team = INITIAL_FORM.team;
          }
        }
        if (!Array.isArray(team)) team = INITIAL_FORM.team;

        setForm((prev) => ({ ...prev, ...incoming, values, team }));
      }
    } catch {
      try {
        const pubRes = await api.get("/public/about");
        const incoming = pubRes.data?.data?.about;
        if (incoming) {
          let values = incoming.values;
          if (typeof values === "string") {
            try {
              values = JSON.parse(values);
            } catch {
              values = INITIAL_FORM.values;
            }
          }
          if (!Array.isArray(values)) values = INITIAL_FORM.values;

          let team = incoming.team;
          if (typeof team === "string") {
            try {
              team = JSON.parse(team);
            } catch {
              team = INITIAL_FORM.team;
            }
          }
          if (!Array.isArray(team)) team = INITIAL_FORM.team;

          setForm((prev) => ({ ...prev, ...incoming, values, team }));
        } else {
          setForm(INITIAL_FORM);
        }
      } catch {
        setForm(INITIAL_FORM);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/about", form);
      showToast("About Us page content saved and updated live on the website!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update About Us content",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddValue = () => {
    const newValue = {
      icon: "Target",
      title: "New Core Value",
      desc: "Describe what this pillar or educational value stands for...",
    };
    setForm({
      ...form,
      values: [...(form.values || []), newValue],
    });
  };

  const handleRemoveValue = (index) => {
    const updated = [...(form.values || [])];
    updated.splice(index, 1);
    setForm({ ...form, values: updated });
  };

  const handleValueChange = (index, field, val) => {
    const updated = [...(form.values || [])];
    updated[index] = { ...updated[index], [field]: val };
    setForm({ ...form, values: updated });
  };

  const handleAddMentor = () => {
    const newMentor = {
      name: "New Mentor Name",
      role: "Senior Instructor & Mentor",
      credentials: "Ex-Staff Engineer, 8+ Years Experience",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    };
    setForm({
      ...form,
      team: [...(form.team || []), newMentor],
    });
  };

  const handleRemoveMentor = (index) => {
    const updated = [...(form.team || [])];
    updated.splice(index, 1);
    setForm({ ...form, team: updated });
  };

  const handleMentorChange = (index, field, val) => {
    const updated = [...(form.team || [])];
    updated[index] = { ...updated[index], [field]: val };
    setForm({ ...form, team: updated });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="About Us CMS"
        description="Curate institutional story headlines, mission & vision statements, core values, mentor profiles, and conversion CTA banners in real-time."
        breadcrumbs={[{ label: "About Us" }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/about"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Preview Live Page</span>
            </Link>
            <button
              type="button"
              onClick={fetchAboutContent}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              title="Reload from database"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
            </button>
          </div>
        }
      />

      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl p-3.5 text-xs font-medium border shadow-xs transition-all ${notification.type === "error"
            ? "bg-rose-50 border-rose-200 text-rose-800"
            : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive
                ? "bg-[#FD8006] text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === "hero" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <Building2 size={18} className="text-blue-600" />
              <span>Top Hero Section</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Hero Eyebrow Badge *"
                required
                value={form.heroBadge}
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                placeholder="e.g. About ApnaVidya"
              />
              <FormInput
                label="Main Heading Headline *"
                required
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                placeholder="e.g. Empowering the Next Generation of India's Builders"
              />
            </div>

            <FormTextarea
              label="Hero Subtitle / Introductory Paragraph *"
              rows={3}
              required
              value={form.heroDescription}
              onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
              placeholder="Lead introduction describing ApnaVidya's mission and purpose..."
            />
          </div>
        )}

        {activeTab === "story" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <Compass size={18} className="text-blue-600" />
                <span>Our Story Narrative</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Story Section Tag"
                  value={form.storyTag}
                  onChange={(e) => setForm({ ...form, storyTag: e.target.value })}
                  placeholder="e.g. Our Story"
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="Story Headline *"
                    required
                    value={form.storyTitle}
                    onChange={(e) => setForm({ ...form, storyTitle: e.target.value })}
                    placeholder="e.g. Bridging the Gap Between College Degrees and Industry Careers"
                  />
                </div>
              </div>

              <FormTextarea
                label="Story Paragraph 1 *"
                rows={3}
                value={form.storyParagraph1}
                onChange={(e) => setForm({ ...form, storyParagraph1: e.target.value })}
                placeholder="Background on education landscape and engineering graduates..."
              />

              <FormTextarea
                label="Story Paragraph 2 *"
                rows={3}
                value={form.storyParagraph2}
                onChange={(e) => setForm({ ...form, storyParagraph2: e.target.value })}
                placeholder="How ApnaVidya addresses this reality through practical projects..."
              />
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <Sparkles size={18} className="text-amber-500" />
                <span>Highlight Statistics</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold text-slate-700">Statistic #1</p>
                  <FormInput
                    label="Stat Value"
                    value={form.stat1Value}
                    onChange={(e) => setForm({ ...form, stat1Value: e.target.value })}
                    placeholder="50,000+"
                  />
                  <FormInput
                    label="Stat Label"
                    value={form.stat1Label}
                    onChange={(e) => setForm({ ...form, stat1Label: e.target.value })}
                    placeholder="Graduated Students"
                  />
                </div>

                <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold text-slate-700">Statistic #2</p>
                  <FormInput
                    label="Stat Value"
                    value={form.stat2Value}
                    onChange={(e) => setForm({ ...form, stat2Value: e.target.value })}
                    placeholder="120+"
                  />
                  <FormInput
                    label="Stat Label"
                    value={form.stat2Label}
                    onChange={(e) => setForm({ ...form, stat2Label: e.target.value })}
                    placeholder="Hiring Company Partners"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mission" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <Target size={18} className="text-indigo-600" />
              <span>Institutional Mission & Long-Term Vision</span>
            </div>

            <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
              <FormInput
                label="Mission Card Title"
                value={form.missionTitle}
                onChange={(e) => setForm({ ...form, missionTitle: e.target.value })}
                placeholder="Our Mission"
              />
              <FormTextarea
                label="Mission Statement *"
                rows={3}
                value={form.missionDescription}
                onChange={(e) => setForm({ ...form, missionDescription: e.target.value })}
                placeholder="Actionable statement about what ApnaVidya provides..."
              />
            </div>

            <div className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
              <FormInput
                label="Vision Card Title"
                value={form.visionTitle}
                onChange={(e) => setForm({ ...form, visionTitle: e.target.value })}
                placeholder="Our Vision"
              />
              <FormTextarea
                label="Vision Statement *"
                rows={3}
                value={form.visionDescription}
                onChange={(e) => setForm({ ...form, visionDescription: e.target.value })}
                placeholder="Long-term aspirational goal for the future..."
              />
            </div>
          </div>
        )}

        {activeTab === "values" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <Layers size={18} className="text-blue-600" />
                <span>Core Values & Pillars</span>
              </div>
              <button
                type="button"
                onClick={handleAddValue}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Value Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Section Eyebrow Tag"
                value={form.valuesTag}
                onChange={(e) => setForm({ ...form, valuesTag: e.target.value })}
                placeholder="e.g. Our Pillars"
              />
              <FormInput
                label="Section Heading *"
                value={form.valuesTitle}
                onChange={(e) => setForm({ ...form, valuesTitle: e.target.value })}
                placeholder="e.g. Values That Drive Everything We Do"
              />
            </div>

            <div className="space-y-4 pt-2">
              {(form.values || []).map((val, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">Pillar #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove value"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <FormInput
                        label="Pillar Title"
                        value={val.title}
                        onChange={(e) => handleValueChange(idx, "title", e.target.value)}
                        placeholder="e.g. Outcome Driven"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Icon Symbol
                      </label>
                      <select
                        value={val.icon || "Target"}
                        onChange={(e) => handleValueChange(idx, "icon", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <FormTextarea
                    label="Pillar Description"
                    rows={2}
                    value={val.desc}
                    onChange={(e) => handleValueChange(idx, "desc", e.target.value)}
                    placeholder="Short description of this value..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <Users size={18} className="text-indigo-600" />
                <span>Mentors & Educators Team</span>
              </div>
              <button
                type="button"
                onClick={handleAddMentor}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Mentor Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Section Tag"
                value={form.teamTag}
                onChange={(e) => setForm({ ...form, teamTag: e.target.value })}
                placeholder="e.g. Experienced Educators"
              />
              <div className="md:col-span-2">
                <FormInput
                  label="Section Title"
                  value={form.teamTitle}
                  onChange={(e) => setForm({ ...form, teamTitle: e.target.value })}
                  placeholder="e.g. Meet the Mentors Behind ApnaVidya"
                />
              </div>
            </div>

            <FormTextarea
              label="Section Subtitle / Description"
              rows={2}
              value={form.teamSubtitle}
              onChange={(e) => setForm({ ...form, teamSubtitle: e.target.value })}
              placeholder="Description of mentor backgrounds and industry expertise..."
            />

            <div className="space-y-4 pt-2">
              {(form.team || []).map((member, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 relative shadow-2xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                    <span className="text-xs font-bold text-slate-800">Mentor #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMentor(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Remove mentor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    {/* Left 50%: Inputs */}
                    <div className="space-y-3">
                      <FormInput
                        label="Full Name"
                        value={member.name}
                        onChange={(e) => handleMentorChange(idx, "name", e.target.value)}
                        placeholder="e.g. Dr. Sandeep Nair"
                      />
                      <FormInput
                        label="Role / Designation"
                        value={member.role}
                        onChange={(e) => handleMentorChange(idx, "role", e.target.value)}
                        placeholder="e.g. Academic Director"
                      />
                      <FormInput
                        label="Credentials / Background Highlights"
                        value={member.credentials}
                        onChange={(e) => handleMentorChange(idx, "credentials", e.target.value)}
                        placeholder="e.g. Ex-Professor IIT, 18+ Years Experience"
                      />
                    </div>

                    {/* Right 50%: Image Preview & Upload */}
                    <div>
                      <ImageUploadPreview
                        label="Mentor Profile Photo"
                        value={member.image}
                        onChange={(url) => handleMentorChange(idx, "image", url)}
                        aspect="square"
                        presets={MENTOR_PRESET_IMAGES}
                        helperText="Upload instructor photo or pick a sample avatar"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cta" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <ArrowRight size={18} className="text-blue-600" />
              <span>Bottom Conversion CTA Banner</span>
            </div>

            <FormInput
              label="Banner Headline *"
              value={form.ctaTitle}
              onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
              placeholder="Experience the ApnaVidya Way of Learning"
            />

            <FormTextarea
              label="Banner Description"
              rows={2}
              value={form.ctaDescription}
              onChange={(e) => setForm({ ...form, ctaDescription: e.target.value })}
              placeholder="Encourage learners to attend demo class or explore courses..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <FormInput
                label="Primary Button Text"
                value={form.ctaPrimaryText}
                onChange={(e) => setForm({ ...form, ctaPrimaryText: e.target.value })}
                placeholder="Book a Free Demo Class"
              />
              <FormInput
                label="Secondary Button Text"
                value={form.ctaSecondaryText}
                onChange={(e) => setForm({ ...form, ctaSecondaryText: e.target.value })}
                placeholder="Explore All Courses"
              />
              <FormInput
                label="Secondary Button Link"
                value={form.ctaSecondaryLink}
                onChange={(e) => setForm({ ...form, ctaSecondaryLink: e.target.value })}
                placeholder="/courses"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            All updates save directly to the database and sync instantly across the user site.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FD8006] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutUsAdmin;
