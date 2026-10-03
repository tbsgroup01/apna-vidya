import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Plus,
  Trash2,
  BookOpen,
  Clock,
  Layers,
  Users,
  IndianRupee,
  Star,
  ChevronDown,
  ChevronUp,
  FileBox,
  Calendar,
  Upload,
  FileText,
  Download,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Paperclip,
  Code,
  FolderArchive,
  GraduationCap,
  Sparkles,
  Award,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import api from "../../../../services/api";

const CourseDetailsAdmin = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("curriculum");
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDuration, setNewModuleDuration] = useState("3 Weeks");
  const [showAddModule, setShowAddModule] = useState(false);

  const [activeLessonModId, setActiveLessonModId] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("60 mins");

  const [activeMaterialModId, setActiveMaterialModId] = useState(null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialType, setMaterialType] = useState("PDF Document");
  const [materialDescription, setMaterialDescription] = useState("");
  const [materialFile, setMaterialFile] = useState(null);
  const [materialUrl, setMaterialUrl] = useState("");
  const [materialVisibility, setMaterialVisibility] = useState("Enrolled Students");
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/courses/${id}`);
      if (res.data?.data?.course) {
        setCourse(res.data.data.course);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    try {
      await api.post(`/admin/courses/${id}/modules`, {
        title: newModuleTitle.trim(),
        duration: newModuleDuration,
      });
      setNewModuleTitle("");
      setShowAddModule(false);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add module");
    }
  };

  const handleDeleteModule = async (modId) => {
    if (!window.confirm("Are you sure you want to delete this module and all its contents?")) return;
    try {
      await api.delete(`/admin/courses/modules/${modId}`);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete module");
    }
  };

  const handleAddLesson = async (modId) => {
    if (!newLessonTitle.trim()) return;
    try {
      await api.post(`/admin/courses/modules/${modId}/lessons`, {
        title: newLessonTitle.trim(),
        duration: newLessonDuration,
      });
      setNewLessonTitle("");
      setActiveLessonModId(null);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add lesson");
    }
  };

  const handleDeleteLesson = async (lesId) => {
    try {
      await api.delete(`/admin/courses/lessons/${lesId}`);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  const handleUploadMaterial = async (modId) => {
    if (!materialTitle.trim()) {
      alert("Please provide a title for the material.");
      return;
    }
    try {
      setUploadingMaterial(true);
      const formData = new FormData();
      formData.append("title", materialTitle.trim());
      formData.append("courseId", String(course.id));
      formData.append("moduleId", String(modId));
      formData.append("fileType", materialType);
      formData.append("description", materialDescription.trim());
      formData.append("visibility", materialVisibility);
      formData.append("status", "Published");

      if (materialFile) {
        formData.append("file", materialFile);
      } else if (materialUrl.trim()) {
        formData.append("file", materialUrl.trim());
      }

      await api.post("/admin/course-materials", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMaterialTitle("");
      setMaterialDescription("");
      setMaterialFile(null);
      setMaterialUrl("");
      setActiveMaterialModId(null);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload module content");
    } finally {
      setUploadingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (matId) => {
    if (!window.confirm("Are you sure you want to delete this course material?")) return;
    try {
      await api.delete(`/admin/course-materials/${matId}`);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course material");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700">
          {error || "Course not found."}
        </div>
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50"
        >
          <ArrowLeft size={15} />
          <span>Back to Courses</span>
        </Link>
      </div>
    );
  }

  const enrolledStudents = course.enrolledStudents || [];
  const courseBatches = course.batches || [];
  const modules = course.modules || [];

  const learningOutcomes = Array.isArray(course.learningOutcomes)
    ? course.learningOutcomes
    : typeof course.learningOutcomes === "string" && course.learningOutcomes.startsWith("[")
      ? JSON.parse(course.learningOutcomes || "[]")
      : [];

  const faqs = Array.isArray(course.faqs)
    ? course.faqs
    : typeof course.faqs === "string" && course.faqs.startsWith("[")
      ? JSON.parse(course.faqs || "[]")
      : [];

  const totalMaterials = modules.reduce((acc, m) => acc + (m.materials?.length || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Manage Course: ${course.name}`}
        description="Configure weekly syllabus topics, upload module-specific materials, and monitor performance metrics."
        breadcrumbs={[
          { label: "Courses", path: "/admin/courses" },
          { label: course.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/courses"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </Link>
            <Link
              to={`/courses/${course.slug || course.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <ExternalLink size={15} />
              <span>Live Page</span>
            </Link>
            <Link
              to={`/admin/courses/${course.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Edit size={15} />
              <span>Edit CMS Details</span>
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <img
              src={course.image || "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80"}
              alt={course.name}
              className="h-24 w-36 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-mono text-[13px]late-400 font-bold">
                  CRS-{course.id}
                </span>
                <StatusBadge status={course.status} size="sm" />
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[12px] font-bold text-blue-600">
                  {course.badge || (course.featured ? "Bestseller" : "Popular")}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[12px] font-bold text-[13px]late-600">
                  {course.level || "Intermediate"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[13px]late-900 mt-1.5">
                {course.name}
              </h2>
              <p className="text-xs text-[13px]late-500 mt-0.5 line-clamp-2 max-w-2xl">
                {course.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-6 text-xs shrink-0">
            <div>
              <p className="text-[13px]late-400">Total Enrolled</p>
              <p className="font-bold text-[13px]late-900 font-mono text-[13px]m">
                {enrolledStudents.length.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[13px]late-400">Tuition Fee</p>
              <p className="font-bold text-[13px]late-900 font-mono text-[13px]m">
                ₹{Number(course.fees || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[13px]late-400">Duration</p>
              <p className="font-bold text-[13px]late-800 text-[13px]m">{course.duration || "6 Months"}</p>
            </div>
            <div>
              <p className="text-[13px]late-400">Curriculum</p>
              <p className="font-bold text-blue-600 font-mono text-[13px]m">
                {modules.length} Modules
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-slate-100 overflow-x-auto">
          {[
            { id: "curriculum", label: `Curriculum Breakdown (${modules.length} Modules)` },
            { id: "overview", label: "CMS Overview & FAQs" },
            { id: "batches", label: `Batches (${courseBatches.length})` },
            { id: "students", label: `Enrolled Learners (${enrolledStudents.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-[13px]late-500 hover:text-[13px]late-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {activeTab === "curriculum" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <h3 className="text-[13px]m font-bold text-[13px]late-900">
                    Curriculum Modules & Lesson Topics Breakdown
                  </h3>
                  <p className="text-xs text-[13px]late-500 mt-0.5">
                    Structure the course into weekly modules and define lessons to present a clear curriculum overview.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModule(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-all shadow-sm cursor-pointer shrink-0"
                >
                  <Plus size={15} />
                  <span>Add Course Module</span>
                </button>
              </div>

              {showAddModule && (
                <form
                  onSubmit={handleAddModule}
                  className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Add New Course Module
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddModule(false)}
                      className="text-[13px]late-400 hover:text-[13px]late-600 text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                        Module Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="e.g. Module 4: Backend Architecture & REST APIs"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                        Module Duration
                      </label>
                      <input
                        type="text"
                        value={newModuleDuration}
                        onChange={(e) => setNewModuleDuration(e.target.value)}
                        placeholder="e.g. 3 Weeks"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModule(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#FD8006] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                    >
                      Save Module
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {modules && modules.length > 0 ? (
                  modules.map((mod, modIdx) => (
                    <div
                      key={mod.id}
                      className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden"
                    >
                      <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FD8006] text-white font-mono text-xs font-bold shadow-xs">
                            {modIdx + 1}
                          </span>
                          <div>
                            <h4 className="text-[13px]m font-bold text-[13px]late-900">
                              {mod.title}
                            </h4>
                            <div className="flex items-center gap-3 text-[13px] text-[13px]late-500 mt-0.5">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock size={12} className="text-[13px]late-400" />
                                {mod.duration || "4 Weeks"}
                              </span>
                              <span>•</span>
                              <span>{mod.lessons?.length || 0} Lessons</span>
                              <span>•</span>
                              <span className="font-semibold text-blue-600">
                                {mod.materials?.length || 0} Materials
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveLessonModId(activeLessonModId === mod.id ? null : mod.id);
                              setActiveMaterialModId(null);
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${activeLessonModId === mod.id
                              ? "bg-slate-800 text-white border-slate-800"
                              : "border-slate-200 bg-white text-[13px]late-700 hover:bg-slate-50"
                              }`}
                          >
                            <Plus size={13} />
                            <span>Add Lesson</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMaterialModId(activeMaterialModId === mod.id ? null : mod.id);
                              setActiveLessonModId(null);
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${activeMaterialModId === mod.id
                              ? "bg-[#FD8006] text-white border-blue-600"
                              : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                              }`}
                          >
                            <Upload size={13} />
                            <span>Upload Material</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteModule(mod.id)}
                            className="rounded-xl p-2 text-[13px]late-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Module"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {activeLessonModId === mod.id && (
                        <div className="p-4 bg-amber-50/50 border-b border-amber-200/60">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-amber-900">
                              Add Lesson to {mod.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveLessonModId(null)}
                              className="text-xs text-[13px]late-400 hover:text-[13px]late-600"
                            >
                              Close
                            </button>
                          </div>
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <input
                              type="text"
                              placeholder="Lesson Topic (e.g. Master Sequelize Associations & Indexing)"
                              value={newLessonTitle}
                              onChange={(e) => setNewLessonTitle(e.target.value)}
                              className="flex-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-amber-600 focus:outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g. 90 mins)"
                              value={newLessonDuration}
                              onChange={(e) => setNewLessonDuration(e.target.value)}
                              className="w-full sm:w-36 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-amber-600 focus:outline-none"
                            />
                            <div className="flex gap-2 w-full sm:w-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => handleAddLesson(mod.id)}
                                className="flex-1 sm:flex-initial rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 cursor-pointer shadow-sm"
                              >
                                Save Lesson
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveLessonModId(null)}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-[13px]late-500 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeMaterialModId === mod.id && (
                        <div className="p-5 bg-blue-50/40 border-b border-blue-200/70 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Upload size={16} className="text-blue-600" />
                              <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                                Upload Content for {mod.title}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveMaterialModId(null)}
                              className="text-xs text-[13px]late-400 hover:text-[13px]late-600"
                            >
                              Close
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                                Content / Material Title *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Chapter 4 Slide Deck & Architecture Cheat Sheet"
                                value={materialTitle}
                                onChange={(e) => setMaterialTitle(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                                Material Type
                              </label>
                              <select
                                value={materialType}
                                onChange={(e) => setMaterialType(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                              >
                                <option value="PDF Document">PDF Document</option>
                                <option value="Source Code ZIP">Source Code ZIP</option>
                                <option value="Lecture Slides">Lecture Slides</option>
                                <option value="Practice Lab">Practice Lab</option>
                                <option value="Cheatsheet">Cheatsheet</option>
                                <option value="Video Lecture">Video Lecture</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                                Upload File (PDF, ZIP, DOCX)
                              </label>
                              <input
                                type="file"
                                onChange={(e) => setMaterialFile(e.target.files[0])}
                                className="w-full text-xs text-[13px]late-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                                Or External File / Drive URL
                              </label>
                              <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                value={materialUrl}
                                onChange={(e) => setMaterialUrl(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                                Short Description / Student Instructions
                              </label>
                              <input
                                type="text"
                                placeholder="Contains practical exercises and starter code repository"
                                value={materialDescription}
                                onChange={(e) => setMaterialDescription(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                                Visibility
                              </label>
                              <select
                                value={materialVisibility}
                                onChange={(e) => setMaterialVisibility(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                              >
                                <option value="Enrolled Students">Enrolled Students Only</option>
                                <option value="Public Preview">Public Preview (Free)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setActiveMaterialModId(null)}
                              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-slate-50 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={uploadingMaterial}
                              onClick={() => handleUploadMaterial(mod.id)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm disabled:opacity-50"
                            >
                              <Upload size={14} />
                              <span>{uploadingMaterial ? "Uploading..." : "Save Module Material"}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <span className="text-xs font-bold text-[13px]late-700 flex items-center gap-1.5">
                              <BookOpen size={14} className="text-[13px]late-400" />
                              <span>Lessons & Lectures ({mod.lessons?.length || 0})</span>
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {mod.lessons && mod.lessons.length > 0 ? (
                              mod.lessons.map((les, lIdx) => (
                                <div
                                  key={les.id}
                                  className="flex items-center justify-between py-2 px-3 text-xs bg-slate-50/70 hover:bg-slate-100/70 rounded-xl transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white border border-slate-200 font-mono text-[12px] text-[13px]late-500 font-bold">
                                      {lIdx + 1}
                                    </span>
                                    <span className="font-medium text-[13px]late-800">{les.title}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-[13px] text-[13px]late-400 shrink-0">
                                    <span className="font-mono">{les.duration}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLesson(les.id)}
                                      className="text-[13px]late-300 hover:text-rose-600 transition-colors cursor-pointer"
                                      title="Delete Lesson"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-[13px]late-400 italic py-2">
                                No lessons added yet. Click &ldquo;Add Lesson&rdquo; to define topics.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <span className="text-xs font-bold text-[13px]late-700 flex items-center gap-1.5">
                              <FolderArchive size={14} className="text-blue-500" />
                              <span>Module Materials & Content ({mod.materials?.length || 0})</span>
                            </span>
                          </div>

                          <div className="space-y-2 pt-1">
                            {mod.materials && mod.materials.length > 0 ? (
                              mod.materials.map((mat) => (
                                <div
                                  key={mat.id}
                                  className="flex items-start justify-between p-2.5 text-xs bg-blue-50/30 border border-blue-100 rounded-xl hover:bg-blue-50/60 transition-colors"
                                >
                                  <div className="flex items-start gap-2.5">
                                    <div className="mt-0.5 p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                                      {mat.fileType?.includes("Code") || mat.fileType?.includes("ZIP") ? (
                                        <Code size={14} />
                                      ) : (
                                        <FileText size={14} />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[13px]late-900 leading-tight">
                                        {mat.title}
                                      </p>
                                      <div className="flex items-center gap-2 text-[13px] text-[13px]late-400 mt-1">
                                        <span className="rounded bg-white px-1.5 py-0.2 border border-slate-200 font-semibold text-[13px]late-600">
                                          {mat.fileType}
                                        </span>
                                        <span>•</span>
                                        <span>{mat.fileSize || "1.5 MB"}</span>
                                        <span>•</span>
                                        <span className="text-emerald-600 font-medium">
                                          {mat.visibility}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    {mat.file && (
                                      <a
                                        href={mat.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100/80 transition-colors"
                                        title="Download / View Material"
                                      >
                                        <Download size={14} />
                                      </a>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMaterial(mat.id)}
                                      className="p-1.5 rounded-lg text-[13px]late-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                      title="Delete Material"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-[13px]late-400 italic py-2">
                                No materials uploaded for this module yet. Click &ldquo;Upload Material&rdquo; above.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <BookOpen size={36} className="mx-auto text-[13px]late-300 mb-2" />
                    <p className="text-xs font-bold text-[13px]late-700">No Curriculum Modules Added Yet</p>
                    <p className="text-xs text-[13px]late-400 max-w-sm mx-auto mt-1 mb-4">
                      Create structured weekly modules to organize topics and upload notes, PDF slides, and code bundles.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddModule(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} />
                      <span>Create First Module</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 p-5 space-y-3 bg-white">
                  <h4 className="font-bold text-[13px]late-900 text-[13px]m flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-600" />
                    <span>What You Will Learn & Build</span>
                  </h4>
                  {learningOutcomes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      {learningOutcomes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[13px]late-700">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px]late-400 italic py-2">No learning outcomes configured.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 space-y-4 bg-white">
                  <h4 className="font-bold text-[13px]late-900 text-[13px]m flex items-center gap-2">
                    <GraduationCap size={16} className="text-blue-600" />
                    <span>Delivery Specifications & Certification</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[13px]late-400 text-[12px] uppercase font-bold block">Class Format</span>
                      <span className="font-bold text-[13px]late-900 mt-0.5 block">{course.classFormat || "100% Live Online"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[13px]late-400 text-[12px] uppercase font-bold block">Batch Timing</span>
                      <span className="font-bold text-[13px]late-900 mt-0.5 block">{course.batchTiming || "Weekday / Weekend"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[13px]late-400 text-[12px] uppercase font-bold block">LMS Access</span>
                      <span className="font-bold text-[13px]late-900 mt-0.5 block">{course.lmsAccess || "Lifetime Access"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[13px]late-400 text-[12px] uppercase font-bold block">Doubt Resolution</span>
                      <span className="font-bold text-emerald-600 mt-0.5 block">{course.doubtResolution || "Daily Live Windows"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div>
                      <span className="text-[13px]late-400 font-bold block">Prerequisites:</span>
                      <span className="text-[13px]late-700">{course.prerequisites || "None specified"}</span>
                    </div>
                    <div>
                      <span className="text-[13px]late-400 font-bold block">Certificate Credential:</span>
                      <span className="text-[13px]late-700">{course.certificateInfo || "ApnaVidya Industry Professional Credential"}</span>
                    </div>
                    <div>
                      <span className="text-[13px]late-400 font-bold block">Target Audience:</span>
                      <span className="text-[13px]late-700">{course.targetAudience || "Open to all students & working professionals"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6 bg-white space-y-3">
                <h4 className="font-bold text-[13px]late-900 text-[13px]m">
                  Rich Detailed Course Overview (Full CMS Body)
                </h4>
                {course.fullOverview ? (
                  <div
                    className="rich-text-content prose prose-slate max-w-none text-[13px]late-700 text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: course.fullOverview }}
                  />
                ) : (
                  <div className="text-[13px]late-400 italic py-3">
                    No rich full overview configured. You can edit this course in the CMS editor to format headers, lists, code blocks, and descriptions.
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 p-6 bg-white space-y-4">
                <h4 className="font-bold text-[13px]late-900 text-[13px]m flex items-center gap-2">
                  <HelpCircle size={16} className="text-blue-600" />
                  <span>Frequently Asked Questions ({faqs.length})</span>
                </h4>
                {faqs.length > 0 ? (
                  <div className="space-y-2.5">
                    {faqs.map((faq, fIdx) => (
                      <div key={fIdx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                        <p className="font-bold text-[13px]late-900">{faq.question}</p>
                        <p className="text-[13px]late-600 mt-1 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px]late-400 italic">No FAQs configured for this course yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "batches" && (
            <div className="space-y-4">
              {courseBatches.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {courseBatches.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[13px]late-900 text-[13px]m">{b.name}</span>
                        <StatusBadge status={b.status} size="sm" />
                      </div>
                      <p className="text-xs text-[13px]late-500 mt-1">
                        Trainer: <span className="font-semibold text-[13px]late-800">{b.trainer || "Faculty Lead"}</span>
                      </p>
                      <div className="mt-3 flex justify-between text-xs text-[13px]late-400 border-t border-slate-100 pt-2">
                        <span>{b.days || "Mon, Wed, Fri"} ({b.startTime || "10:00 AM"} - {b.endTime || "01:00 PM"})</span>
                        <span className="font-mono text-[13px]late-700 font-bold">{b.capacity || 40} Seats</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[13px]late-400 italic py-4">
                  No active batches currently scheduled for this course.
                </p>
              )}
            </div>
          )}

          {activeTab === "students" && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[13px] font-bold uppercase text-[13px]late-500">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrolledStudents.length > 0 ? (
                    enrolledStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-bold text-[13px]late-900">{s.name}</td>
                        <td className="p-3.5 text-[13px]late-500">{s.email}</td>
                        <td className="p-3.5 font-mono">{s.phone || "N/A"}</td>
                        <td className="p-3.5">
                          <StatusBadge status={s.status || "Active"} size="sm" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-[13px]late-400 italic">
                        No enrolled learners found for this program.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsAdmin;
