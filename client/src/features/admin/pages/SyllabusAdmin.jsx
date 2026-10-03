import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Layers,
  Plus,
  Trash2,
  Clock,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Edit,
  Search,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import api from "../../../services/api";

const SyllabusAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCourseId = searchParams.get("courseId") || "";

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [course, setCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDuration, setNewModuleDuration] = useState("4 Weeks");
  const [submittingModule, setSubmittingModule] = useState(false);

  const [activeLessonModId, setActiveLessonModId] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("60 mins");
  const [submittingLesson, setSubmittingLesson] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await api.get("/admin/courses?limit=100");
      if (res.data?.data?.courses) {
        const list = res.data.data.courses;
        setCourses(list);
        if (list.length > 0 && !selectedCourseId) {
          const firstId = String(list[0].id);
          setSelectedCourseId(firstId);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    if (!courseId) return;
    try {
      setLoadingDetails(true);
      const res = await api.get(`/admin/courses/${courseId}`);
      if (res.data?.data?.course) {
        setCourse(res.data.data.course);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseDetails(selectedCourseId);
      setSearchParams({ courseId: selectedCourseId }, { replace: true });
    }
  }, [selectedCourseId]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim() || !selectedCourseId) return;
    try {
      setSubmittingModule(true);
      await api.post(`/admin/courses/${selectedCourseId}/modules`, {
        title: newModuleTitle.trim(),
        duration: newModuleDuration.trim() || "4 Weeks",
      });
      setNewModuleTitle("");
      setNewModuleDuration("4 Weeks");
      setShowAddModule(false);
      fetchCourseDetails(selectedCourseId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create module");
    } finally {
      setSubmittingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module and its topics?")) return;
    try {
      await api.delete(`/admin/courses/modules/${moduleId}`);
      fetchCourseDetails(selectedCourseId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete module");
    }
  };

  const handleAddLesson = async (moduleId) => {
    if (!newLessonTitle.trim()) return;
    try {
      setSubmittingLesson(true);
      await api.post(`/admin/courses/modules/${moduleId}/lessons`, {
        title: newLessonTitle.trim(),
        duration: newLessonDuration.trim() || "60 mins",
      });
      setNewLessonTitle("");
      setNewLessonDuration("60 mins");
      setActiveLessonModId(null);
      fetchCourseDetails(selectedCourseId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add lesson");
    } finally {
      setSubmittingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await api.delete(`/admin/courses/lessons/${lessonId}`);
      fetchCourseDetails(selectedCourseId);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modules = course?.modules || [];
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Curriculum & Module Breakdown"
        description="Structure courses into sequential learning modules, define week-by-week topic roadmaps, and preview public syllabus."
        breadcrumbs={[
          { label: "Courses", path: "/admin/courses" },
          { label: "Curriculum Breakdown" },
        ]}
        actions={
          course && (
            <div className="flex items-center gap-2">
              <Link
                to={`/courses/${course.slug || course.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <ExternalLink size={14} />
                <span>Live Course View</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowAddModule(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer active:scale-95 transition-all"
              >
                <Plus size={15} />
                <span>Add Module</span>
              </button>
            </div>
          )
        }
      />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[13px]late-700 block">
              Select Course to Manage Curriculum
            </label>
            <p className="text-xs text-[13px]late-400 mt-0.5">
              Choose an active program to organize its learning journey week-by-week.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-[13px]late-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-48 sm:w-56 rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-[13px]late-700 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[13px]late-800 focus:border-blue-600 focus:outline-none"
            >
              {filteredCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {course && (
          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3.5">
              <img
                src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"}
                alt={course.name}
                className="h-14 w-20 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[13px]late-900 text-[13px]m">
                    {course.name}
                  </span>
                  <StatusBadge status={course.status} size="sm" />
                  <span className="rounded-full bg-blue-100/80 px-2 py-0.5 text-[12px] font-bold text-blue-700">
                    {course.category?.name || "Professional"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[13px]late-500 mt-1">
                  <span>Duration: {course.duration || "6 Months"}</span>
                  <span>•</span>
                  <span>Fee: ₹{Number(course.fees || 0).toLocaleString()}</span>
                  <span>•</span>
                  <span className="font-semibold text-[13px]late-700">
                    Level: {course.level || "Beginner to Advanced"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5 shrink-0">
              <div className="text-center">
                <span className="text-[12px] uppercase font-bold text-[13px]late-400 block">
                  Total Modules
                </span>
                <span className="text-base font-extrabold text-blue-600 font-mono">
                  {modules.length}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[12px] uppercase font-bold text-[13px]late-400 block">
                  Topics / Lessons
                </span>
                <span className="text-base font-extrabold text-[13px]late-800 font-mono">
                  {totalLessons}
                </span>
              </div>
              <Link
                to={`/admin/courses/${course.id}/edit`}
                className="p-2 rounded-xl text-[13px]late-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
                title="Edit Course Details"
              >
                <Edit size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {showAddModule && (
        <form
          onSubmit={handleAddModule}
          className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-blue-600" />
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                Create New Curriculum Module
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModule(false)}
              className="text-xs text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                Module Title *
              </label>
              <input
                type="text"
                required
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="e.g. Module 3: State Management & Redux Toolkit"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[13px]late-700 mb-1">
                Duration / Pacing
              </label>
              <input
                type="text"
                value={newModuleDuration}
                onChange={(e) => setNewModuleDuration(e.target.value)}
                placeholder="e.g. 4 Weeks"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddModule(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingModule}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Plus size={14} />
              <span>{submittingModule ? "Saving..." : "Add Module to Curriculum"}</span>
            </button>
          </div>
        </form>
      )}

      {loadingDetails ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : modules.length > 0 ? (
        <div className="space-y-4">
          {modules.map((mod, modIdx) => (
            <div
              key={mod.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all"
            >
              <div className="bg-slate-50/70 p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                      <span className="font-semibold text-blue-600">
                        {mod.lessons?.length || 0} Topics & Lessons
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLessonModId(activeLessonModId === mod.id ? null : mod.id)
                    }
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${activeLessonModId === mod.id
                      ? "bg-[#FD8006] text-white border-blue-600"
                      : "border-slate-200 bg-white text-[13px]late-700 hover:bg-slate-50"
                      }`}
                  >
                    <Plus size={13} />
                    <span>Add Lesson / Topic</span>
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
                <div className="p-4 bg-blue-50/40 border-b border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Add Lesson Topic to {mod.title}
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
                      placeholder="e.g. Master React Portals, Error Boundaries & Custom Hooks"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="flex-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 60 mins)"
                      value={newLessonDuration}
                      onChange={(e) => setNewLessonDuration(e.target.value)}
                      className="w-full sm:w-36 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-[13px]late-800 focus:border-blue-600 focus:outline-none"
                    />
                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        disabled={submittingLesson}
                        onClick={() => handleAddLesson(mod.id)}
                        className="flex-1 sm:flex-initial rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        {submittingLesson ? "Saving..." : "Save Lesson"}
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

              <div className="p-4 divide-y divide-slate-50">
                {mod.lessons && mod.lessons.length > 0 ? (
                  mod.lessons.map((les, lIdx) => (
                    <div
                      key={les.id}
                      className="flex items-center justify-between py-2.5 px-3 text-xs hover:bg-slate-50/80 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 font-mono text-[12px] text-[13px]late-500 font-bold">
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
                  <p className="text-xs text-[13px]late-400 italic py-2 px-3">
                    No lesson topics defined yet. Click &ldquo;Add Lesson / Topic&rdquo; to build this module.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 shadow-xs">
          <BookOpen size={40} className="mx-auto text-[13px]late-300 mb-3" />
          <h3 className="text-[13px]m font-bold text-[13px]late-900">
            No Modules Created For This Course
          </h3>
          <p className="text-xs text-[13px]late-400 max-w-md mx-auto mt-1 mb-5">
            Break down this program into weekly modules to give learners a clear curriculum roadmap.
          </p>
          <button
            type="button"
            onClick={() => setShowAddModule(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-sm"
          >
            <Plus size={15} />
            <span>Create First Module</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SyllabusAdmin;
