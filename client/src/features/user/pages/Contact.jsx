import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  ExternalLink,
} from "lucide-react";
import api from "../../../services/api";
import { useSettings } from "../../../context/SettingsContext";
import { sendOtp, verifyOtp, isValidMobile } from "../../../services/otpService";
import OtpVerificationStep from "../components/OtpVerificationStep";

const Contact = () => {
  const { settings } = useSettings();
  const contact = settings.contact || {};
  const siteName = settings.general?.siteName || "APNAVIDYA";

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [step, setStep] = useState("form"); // "form" | "otp" | "success"
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/public/courses?limit=100");
        if (res.data?.data?.courses) {
          setCourses(res.data.data.courses);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!isValidMobile(formData.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.message.trim()) {
      setError("Please enter your message.");
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

  const handleVerifyOtp = async (code) => {
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(formData.phone, code);

      await api.post("/public/leads/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course: formData.subject,
        source: "Contact Form",
        message: `${formData.message.trim()} [Mobile OTP Verified]`,
      });

      setStep("success");
      setIsSent(true);
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

  const primaryPhone = contact.phone || "+91 98765 43210";
  const alternatePhone = contact.alternatePhone;
  const primaryEmail = contact.email || "admissions@apnavidya.com";
  const supportEmail = contact.supportEmail || "support@apnavidya.com";
  const address = contact.address || "APNAVIDYA Tower, 4th Floor, Sector 62, Noida, UP - 201301";
  const workingHours = contact.workingHours || "Mon - Sat: 9:00 AM - 7:00 PM";
  const googleMapsUrl = contact.googleMapsUrl;

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <Headphones size={15} />
            We&apos;re Here to Help
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[13px]late-900 sm:text-5xl">
            Get in Touch with <span className="text-blue-600">{siteName}</span>
          </h1>
          <p className="mt-3 text-base text-[13px]late-600">
            Have questions about course admissions, fee structures, demo classes,
            or enterprise partnerships? Our team is available 6 days a week.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[13px]late-900">
                Contact Information
              </h2>
              <p className="mt-1 text-xs text-[13px]late-500">
                Reach out to our student helpline or drop by our learning center.
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[13px]late-400">
                      Admissions Helpline
                    </h3>
                    <a
                      href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                      className="mt-0.5 block text-[13px]m font-bold text-[13px]late-900 hover:text-blue-600"
                    >
                      {primaryPhone}
                    </a>
                    {alternatePhone && alternatePhone !== primaryPhone && (
                      <a
                        href={`tel:${alternatePhone.replace(/\s+/g, "")}`}
                        className="mt-0.5 block text-xs font-semibold text-[13px]late-600 hover:text-blue-600"
                      >
                        Alt: {alternatePhone}
                      </a>
                    )}
                    <p className="text-xs text-[13px]late-500 mt-0.5">{workingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[13px]late-400">
                      Email Support
                    </h3>
                    <a
                      href={`mailto:${primaryEmail}`}
                      className="mt-0.5 block text-[13px]m font-bold text-[13px]late-900 hover:text-blue-600"
                    >
                      {primaryEmail}
                    </a>
                    {supportEmail && supportEmail !== primaryEmail && (
                      <a
                        href={`mailto:${supportEmail}`}
                        className="mt-0.5 block text-xs font-semibold text-[13px]late-600 hover:text-blue-600"
                      >
                        Support: {supportEmail}
                      </a>
                    )}
                    <p className="text-xs text-[13px]late-500 mt-0.5">
                      We reply within 4 business hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[13px]late-400">
                      Corporate Campus
                    </h3>
                    <p className="mt-0.5 text-[13px]m font-bold text-[13px]late-900 leading-snug">
                      {address}
                    </p>

                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-600" />
                <div>
                  <h3 className="text-[13px]m font-bold text-[13px]late-900">
                    Counseling Operating Hours
                  </h3>
                  <p className="text-xs text-[13px]late-500">
                    {workingHours}
                  </p>
                  <p className="text-xs text-[13px]late-500 mt-0.5">Live sessions and counseling support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
              {step === "form" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Our academic advisors will get back to you with personalized
                    guidance.
                  </p>

                  {error && (
                    <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (error) setError(null);
                          }}
                          placeholder="Your name"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (error) setError(null);
                          }}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (error) setError(null);
                          }}
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                          Inquiry Type
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <optgroup label="General Categories">
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Course Admission">Course Admission</option>
                            <option value="Career & Placement">Placement Guidance</option>
                            <option value="Corporate Training">Corporate Training</option>
                          </optgroup>
                          {courses.length > 0 && (
                            <optgroup label="Academic Programs">
                              {courses.map((c) => (
                                <option key={c.id} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (error) setError(null);
                        }}
                        placeholder="Tell us about your learning goals or questions..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FD8006] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Send size={16} />
                      <span>{loading ? "Sending OTP..." : "Send Inquiry Message"}</span>
                    </button>
                  </form>
                </div>
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
                  title="Verify Mobile Number"
                  subtitle="Please enter the 4-digit SMS OTP to send your inquiry:"
                  submitLabel="Verify & Send Message"
                />
              )}

              {step === "success" && (
                <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-bold">{formData.name}</span>.
                    We have verified your phone number and our academic counselor will contact you at{" "}
                    <span className="font-bold">{formData.phone}</span> within 4
                    hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setIsSent(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        subject: "General Inquiry",
                        message: "",
                      });
                    }}
                    className="mt-6 rounded-xl bg-[#FD8006] px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
