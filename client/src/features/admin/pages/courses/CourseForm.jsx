import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookOpen,
  Layers,
  Image as ImageIcon,
  Search as SearchIcon,
  Plus,
  Tags,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Award,
  Sparkles,
  Video,
  ListChecks,
  FileText,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { FormInput, FormSelect, FormTextarea, ImageUploadPreview, DocumentUpload } from "../../components/FormControls";
import RichTextEditor from "../../components/RichTextEditor";
import api from "../../../../services/api";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [activeTab, setActiveTab] = useState("basic");
  const [categoriesList, setCategoriesList] = useState([]);
  const [quickCatModalOpen, setQuickCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newOutcome, setNewOutcome] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    duration: "6 Months",
    level: "Beginner to Advanced",
    fees: 32000,
    originalFees: 50000,
    classFormat: "100% Live Online",
    batchTiming: "Weekday / Weekend",
    lmsAccess: "Lifetime Validity",
    doubtResolution: "Daily Live Windows",
    status: "Active",
    badge: "Bestseller",
    shortDescription: "",
    fullOverview: "<h2>Program Summary</h2><p>Learn core concepts, complete industry projects, and prepare for interviews with live mentorship.</p>",
    learningOutcomes: [
      "Industry-standard project portfolio",
      "1-on-1 weekly code review sessions",
      "Live interactive query resolution",
      "Official ISO certification upon completion",
    ],
    prerequisites: "Basic computer familiarity. No prior coding experience required.",
    certificateInfo: "ISO 9001:2015 Verified Certificate of Completion with unique verification ID.",
    targetAudience: "College Students, Working Professionals, Tech Career Switchers",
    faqs: [
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, our curriculum starts from fundamental principles before advancing to real-world architectures.",
      },
      {
        question: "Will I receive a verified certificate?",
        answer: "Yes, upon successfully completing the capstone project, you receive an ISO-verified credential.",
      },
    ],
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
    syllabusUrl: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/courses/categories/all");
        if (res.data?.data?.categories) {
          setCategoriesList(res.data.data.categories);
          if (!formData.categoryId && res.data.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: res.data.data.categories[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchCourse = async () => {
        try {
          const res = await api.get(`/admin/courses/${id}`);
          if (res.data?.data?.course) {
            const c = res.data.data.course;
            setFormData({
              title: c.name || "",
              slug: c.slug || "",
              categoryId: c.categoryId || "",
              duration: c.duration || "6 Months",
              level: c.level || "Beginner to Advanced",
              fees: c.fees || 0,
              originalFees: c.fees ? Math.round(c.fees * 1.5) : 50000,
              classFormat: c.classFormat || "100% Live Online",
              batchTiming: c.batchTiming || "Weekday / Weekend",
              lmsAccess: c.lmsAccess || "Lifetime Validity",
              doubtResolution: c.doubtResolution || "Daily Live Windows",
              status: c.status || "Active",
              badge: c.featured ? "Bestseller" : "Popular",
              shortDescription: c.description || "",
              fullOverview: c.fullOverview || c.description || "",
              learningOutcomes: Array.isArray(c.learningOutcomes) && c.learningOutcomes.length > 0
                ? c.learningOutcomes
                : [
                  "Industry-standard project portfolio",
                  "1-on-1 weekly code review sessions",
                  "Live interactive query resolution",
                  "Official ISO certification upon completion",
                ],
              prerequisites: c.prerequisites || "Basic computer familiarity.",
              certificateInfo: c.certificateInfo || "ISO 9001:2015 Verified Certificate of Completion.",
              targetAudience: c.targetAudience || "College Students, Working Professionals",
              faqs: Array.isArray(c.faqs) && c.faqs.length > 0
                ? c.faqs
                : [
                  {
                    question: "Is this course suitable for beginners?",
                    answer: "Yes, our curriculum starts from fundamental principles.",
                  },
                ],
              image: c.image || "",
              syllabusUrl: c.syllabusUrl || "",
              seoTitle: c.name ? `${c.name} | Apna Vidya` : "",
              seoDescription: c.description || "",
            });
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load course details");
        }
      };
      fetchCourse();
    }
  }, [id, isEdit]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (field === "title" && !isEdit) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleQuickAddCategory = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    try {
      const res = await api.post("/admin/courses/categories", { name: trimmed });
      const created = res.data?.data?.category;
      if (created) {
        setCategoriesList((prev) => {
          const exists = prev.some((c) => String(c.id) === String(created.id));
          return exists ? prev : [...prev, created];
        });
        setFormData((prev) => ({ ...prev, categoryId: created.id }));
      }
      setQuickCatModalOpen(false);
      setNewCatName("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleAddOutcome = (e) => {
    e.preventDefault();
    if (!newOutcome.trim()) return;
    setFormData((prev) => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, newOutcome.trim()],
    }));
    setNewOutcome("");
  };

  const handleRemoveOutcome = (idx) => {
    setFormData((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== idx),
    }));
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const handleFaqChange = (index, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.faqs];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.title,
        slug: formData.slug,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        duration: formData.duration,
        level: formData.level,
        fees: Number(formData.fees),
        status: formData.status,
        image: formData.image,
        description: formData.shortDescription,
        fullOverview: formData.fullOverview,
        learningOutcomes: formData.learningOutcomes,
        prerequisites: formData.prerequisites,
        certificateInfo: formData.certificateInfo,
        classFormat: formData.classFormat,
        batchTiming: formData.batchTiming,
        lmsAccess: formData.lmsAccess,
        doubtResolution: formData.doubtResolution,
        targetAudience: formData.targetAudience,
        faqs: formData.faqs,
        featured: formData.badge === "Bestseller",
        syllabusUrl: formData.syllabusUrl || null,
      };

      if (isEdit) {
        await api.put(`/admin/courses/${id}`, payload);
      } else {
        await api.post("/admin/courses", payload);
      }
      navigate("/admin/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course CMS details");
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info & Media", icon: BookOpen },
    { id: "pricing", label: "Tuition & Delivery", icon: Layers },
    // { id: "overview", label: "Rich Overview", icon: Sparkles },
    { id: "outcomes", label: "Learning Outcomes", icon: ListChecks },
    // { id: "certs", label: "Prerequisites & FAQs", icon: HelpCircle },
    // { id: "seo", label: "SEO & Indexing", icon: SearchIcon },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={isEdit ? `Course CMS: ${formData.title}` : "Create Course CMS Program"}
        description={
          isEdit
            ? `Manage curriculum details, rich text descriptions, learning outcomes, and delivery metadata for ${id}.`
            : "Define basic info, learning outcomes, rich syllabus text, FAQs, and fees for a new training program."
        }
        breadcrumbs={[
          { label: "Courses", path: "/admin/courses" },
          { label: isEdit ? "Edit Course CMS" : "New Course" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/courses"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Save size={16} />
              <span>{loading ? "Saving CMS..." : isEdit ? "Save Changes" : "Publish Program"}</span>
            </button>
          </div>
        }
      />

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="flex gap-2  border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <BookOpen size={18} className="text-blue-600" />
                <span>Basic Course Identity</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Course Title"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. Ethical Hacking & Cyber Security Masterclass"
                />
                <FormInput
                  label="URL Slug"
                  required
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="ethical-hacking-cyber-security"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setQuickCatModalOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>New Category</span>
                    </button>
                  </div>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleChange("categoryId", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-2xs transition-all focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <FormSelect
                  label="Course Badge"
                  value={formData.badge}
                  onChange={(e) => handleChange("badge", e.target.value)}
                  options={["Bestseller", "Trending", "Popular", "New", "High Demand"]}
                />

                <FormSelect
                  label="Publishing Status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  options={["Active", "Draft", "Archived"]}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  placeholder="e.g. 6 Months"
                />
                <FormSelect
                  label="Difficulty Level"
                  value={formData.level}
                  onChange={(e) => handleChange("level", e.target.value)}
                  options={["Beginner", "Beginner to Advanced", "Intermediate", "Advanced", "All Levels"]}
                />
              </div>

              <FormTextarea
                label="Short Tagline / Card Summary"
                rows={2}
                required
                value={formData.shortDescription}
                onChange={(e) => handleChange("shortDescription", e.target.value)}
                placeholder="1-2 sentences highlighting tech stack and target learning outcome."
              />
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <ImageIcon size={18} className="text-emerald-600" />
                <span>Media & Visual Assets</span>
              </div>

              <ImageUploadPreview
                label="Course Cover Banner (800x450 recommended)"
                value={formData.image}
                onChange={(url) => handleChange("image", url)}
                aspect="video"
                helperText="Displays across course catalog cards, syllabus headers, and search previews"
              />
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <FileText size={18} className="text-blue-600" />
                <span>Course Syllabus (Downloadable PDF / Document)</span>
              </div>

              <DocumentUpload
                label="Upload or Link Syllabus Document"
                value={formData.syllabusUrl}
                onChange={(url) => handleChange("syllabusUrl", url)}
                helperText="Students on the course details page will be able to download this syllabus directly from the 'Download Syllabus' button."
              />
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <Layers size={18} className="text-indigo-600" />
              <span>Tuition Fees & Delivery Highlights</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label="Tuition Fees (₹)"
                type="number"
                required
                value={formData.fees}
                onChange={(e) => handleChange("fees", Number(e.target.value))}
              />
              <FormInput
                label="Original Fee / Strike Price (₹)"
                type="number"
                value={formData.originalFees}
                onChange={(e) => handleChange("originalFees", Number(e.target.value))}
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Effective Discount
                </label>
                <div className="h-10.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 flex items-center text-sm font-bold text-emerald-600">
                  {formData.originalFees > formData.fees
                    ? `${Math.round(((formData.originalFees - formData.fees) / formData.originalFees) * 100)}% Discount`
                    : "Standard Price"}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Class Format"
                value={formData.classFormat}
                onChange={(e) => handleChange("classFormat", e.target.value)}
                placeholder="e.g. 100% Live Online"
              />
              <FormInput
                label="Batch Timing"
                value={formData.batchTiming}
                onChange={(e) => handleChange("batchTiming", e.target.value)}
                placeholder="e.g. Weekday / Weekend"
              />
              <FormInput
                label="LMS Access"
                value={formData.lmsAccess}
                onChange={(e) => handleChange("lmsAccess", e.target.value)}
                placeholder="e.g. Lifetime Validity"
              />
              <FormInput
                label="Doubt Resolution"
                value={formData.doubtResolution}
                onChange={(e) => handleChange("doubtResolution", e.target.value)}
                placeholder="e.g. Daily Live Windows"
              />
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <Sparkles size={18} className="text-purple-600" />
              <span>Comprehensive Course Overview (Rich Text)</span>
            </div>

            <RichTextEditor
              label="Course In-Depth Content & Description"
              value={formData.fullOverview}
              onChange={(val) => handleChange("fullOverview", val)}
              placeholder="Provide a detailed roadmap, practical projects, tech stack overview, and career benefits..."
              minHeight="280px"
            />
          </div>
        )}

        {activeTab === "outcomes" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                <ListChecks size={18} className="text-emerald-600" />
                <span>What You Will Learn & Build</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {formData.learningOutcomes.length} Outcomes Listed
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newOutcome}
                onChange={(e) => setNewOutcome(e.target.value)}
                placeholder="e.g. Master React 19 Server Components and Suspense streaming"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddOutcome}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Outcome</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {formData.learningOutcomes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOutcome(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certs" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <Award size={18} className="text-amber-600" />
                <span>Prerequisites & Certification</span>
              </div>

              <FormTextarea
                label="Prerequisites"
                rows={2}
                value={formData.prerequisites}
                onChange={(e) => handleChange("prerequisites", e.target.value)}
                placeholder="e.g. Basic computer familiarity. No prior coding experience required."
              />

              <FormTextarea
                label="Certification Details"
                rows={2}
                value={formData.certificateInfo}
                onChange={(e) => handleChange("certificateInfo", e.target.value)}
                placeholder="e.g. ISO 9001:2015 Verified Certificate of Completion with verifiable credentials."
              />

              <FormInput
                label="Target Audience / Who Should Enroll"
                value={formData.targetAudience}
                onChange={(e) => handleChange("targetAudience", e.target.value)}
                placeholder="e.g. College Students, Working Professionals, Career Switchers"
              />
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
                  <HelpCircle size={18} className="text-blue-600" />
                  <span>Frequently Asked Questions (FAQs)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Remove FAQ"
                    >
                      <Trash2 size={14} />
                    </button>
                    <input
                      type="text"
                      placeholder="Question: e.g. What if I miss a live class?"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Answer: e.g. All live sessions are recorded and available in your student portal."
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <SearchIcon size={18} className="text-indigo-600" />
              <span>SEO Meta & Search Optimization</span>
            </div>

            <FormInput
              label="Meta Title"
              value={formData.seoTitle}
              onChange={(e) => handleChange("seoTitle", e.target.value)}
              placeholder="e.g. Best Ethical Hacking Masterclass 2026 | Apna Vidya"
            />
            <FormTextarea
              label="Meta Description"
              rows={3}
              value={formData.seoDescription}
              onChange={(e) => handleChange("seoDescription", e.target.value)}
              placeholder="Search engine snippet summary (max 160 characters)..."
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            to="/admin/courses"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>{loading ? "Saving..." : isEdit ? "Update Course CMS" : "Publish Course CMS"}</span>
          </button>
        </div>
      </form>

      {quickCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Tags size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create Course Category
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add a new category to assign this course immediately.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleQuickAddCategory} className="space-y-4">
              <FormInput
                label="Category Name"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Cybersecurity & Ethical Hacking"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setQuickCatModalOpen(false);
                    setNewCatName("");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCatName.trim()}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Add & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseForm;
