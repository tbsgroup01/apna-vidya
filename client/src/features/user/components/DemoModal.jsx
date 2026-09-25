import React, { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import api from "../../../services/api";

const DemoModal = ({ isOpen, onClose, initialCourse = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: initialCourse || "",
  });
  const [coursesList, setCoursesList] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/public/courses?limit=100");
        if (res.data?.data?.courses) {
          const list = res.data.data.courses;
          setCoursesList(list);
          if (!formData.course && list.length > 0) {
            setFormData((prev) => ({ ...prev, course: initialCourse || list[0].name }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [initialCourse]);

  useEffect(() => {
    if (initialCourse) {
      setFormData((prev) => ({ ...prev, course: initialCourse }));
    }
  }, [initialCourse]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/public/leads/demo", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course || "General Program",
        source: "Demo Class",
        message: "Booked free demo class trial via website popup modal",
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit demo request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setError(null);
    setFormData({ name: "", phone: "", email: "", course: initialCourse || (coursesList[0]?.name || "") });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={handleClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-gray-100 my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <>
            <div className="mb-6 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Book a Free Demo Class
              </h3>
              <p className="mt-1 text-[13px]m text-gray-500">
                Fill in your details below and our academic mentor will connect with you.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter student full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px]m text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px]m text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="student@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px]m text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Interested Course / Class *
                </label>
                <select
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-[13px]m text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                >
                  <option value="">Select a Course or Program *</option>
                  {coursesList && coursesList.length > 0 ? (
                    coursesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} {c.duration ? `(${c.duration})` : ""}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Full Stack Development">Full Stack Development</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science & AI">Data Science & AI</option>
                    </>
                  )}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-3 text-[13px]m font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {loading ? "Registering Demo..." : "Confirm & Book Free Demo"}
                </button>
              </div>

              <p className="text-center text-[13px] text-gray-400">
                🔒 Your personal information is secure and will never be shared.
              </p>
            </form>
          </>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Demo Class Booked Successfully!
              </h3>
              <p className="mt-2 text-[13px]m text-gray-600 max-w-sm mx-auto">
                Thank you, <span className="font-semibold text-gray-800">{formData.name}</span>! We have received your request for <span className="font-semibold text-blue-600">{formData.course}</span>. Our academic counselor will contact you at <span className="font-semibold text-gray-800">{formData.phone}</span> shortly.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-[13px]m font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoModal;
