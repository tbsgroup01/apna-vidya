import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Download, FileText } from "lucide-react";
import api from "../../../services/api";
import { sendOtp, verifyOtp, isValidMobile } from "../../../services/otpService";
import OtpVerificationStep from "./OtpVerificationStep";

const DemoModal = ({ isOpen, onClose, initialCourse = "", options = {} }) => {
  const isSyllabus = options?.mode === "syllabus" || Boolean(options?.syllabusUrl);
  const syllabusUrl = options?.syllabusUrl || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: initialCourse || "",
  });
  const [coursesList, setCoursesList] = useState([]);
  const [step, setStep] = useState("form"); // "form" | "otp" | "success"
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
    if (error) setError(null);
  };

  // Step 1: Submit Form -> Validate Phone & Dispatch OTP via SMS
  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Please enter the student's name.");
      return;
    }

    if (!isValidMobile(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(formData.phone);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to send verification SMS. Please check your mobile number.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Entered OTP -> Finalize Lead Booking
  const handleVerifyOtp = async (code) => {
    setLoading(true);
    setError(null);
    try {
      // Verify OTP code
      await verifyOtp(formData.phone, code);

      // Submit lead to backend
      await api.post("/public/leads/demo", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course || "General Program",
        source: isSyllabus ? "Syllabus Download" : "Demo Class",
        message: isSyllabus
          ? `Requested and downloaded syllabus for ${formData.course || initialCourse} [Mobile OTP Verified]`
          : "Booked free demo class trial via website popup modal [Mobile OTP Verified]",
      });

      setStep("success");

      if (isSyllabus && syllabusUrl) {
        setTimeout(() => {
          const link = document.createElement("a");
          link.href = syllabusUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.download = "";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 400);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    try {
      await sendOtp(formData.phone);
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
      throw err;
    }
  };

  const handleClose = () => {
    setStep("form");
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

        {step === "form" && (
          <>
            <div className="mb-6 text-center sm:text-left">
              <div className="flex items-center gap-2.5 mb-1.5 justify-center sm:justify-start">
                {isSyllabus ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
                    <Download size={18} />
                  </div>
                ) : null}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isSyllabus ? "Download Course Syllabus" : "Book a Free Demo Class"}
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                {isSyllabus
                  ? "Please fill in your details below to instantly download the comprehensive curriculum syllabus."
                  : "Fill in your details below and our academic mentor will connect with you."}
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Program / Course *
                </label>
                <select
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all bg-white"
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
                  className="w-full rounded-xl bg-[#FD8006] py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {isSyllabus && <Download size={16} />}
                  <span>
                    {loading
                      ? isSyllabus
                        ? "Sending OTP..."
                        : "Sending OTP..."
                      : isSyllabus
                        ? "Submit & Download Syllabus"
                        : "Confirm & Book Free Demo"}
                  </span>
                </button>
              </div>

              <p className="text-center text-xs text-gray-400">
                🔒 Your personal information is secure and will never be shared.
              </p>
            </form>
          </>
        )}

        {step === "otp" && (
          <OtpVerificationStep
            phone={formData.phone}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={() => {
              setStep("form");
              setError(null);
            }}
            loading={loading}
            error={error}
            title={isSyllabus ? "Verify for Syllabus Access" : "Verify Mobile Number"}
            subtitle="Enter the 4-digit SMS OTP to confirm your booking:"
            submitLabel={isSyllabus ? "Verify & Download Syllabus" : "Verify & Book Free Demo"}
          />
        )}

        {step === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {isSyllabus ? "Syllabus Download Ready!" : "Demo Class Booked Successfully!"}
              </h3>
              <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                {isSyllabus ? (
                  <>
                    Thank you, <span className="font-semibold text-gray-800">{formData.name}</span>! Your curriculum syllabus for{" "}
                    <span className="font-semibold text-blue-600">{formData.course}</span>{" "}
                    {syllabusUrl ? "is downloading now." : "has been requested and will be sent to your email and phone shortly."}
                  </>
                ) : (
                  <>
                    Thank you, <span className="font-semibold text-gray-800">{formData.name}</span>! We have verified your number and received your request for{" "}
                    <span className="font-semibold text-blue-600">{formData.course}</span>. Our academic counselor will contact you at{" "}
                    <span className="font-semibold text-gray-800">{formData.phone}</span> shortly.
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              {isSyllabus && syllabusUrl && (
                <a
                  href={syllabusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FD8006] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Download size={16} />
                  <span>Download Again</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoModal;
