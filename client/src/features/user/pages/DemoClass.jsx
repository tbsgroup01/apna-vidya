import React, { useState } from "react";
import {
  PlayCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Video,
} from "lucide-react";
import api from "../../../services/api";
import { sendOtp, verifyOtp, isValidMobile } from "../../../services/otpService";
import OtpVerificationStep from "../components/OtpVerificationStep";
import { coursesData } from "../../../data/coursesData";

const DemoClass = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: coursesData[0].title,
    date: "",
    slot: "Evening (6:00 PM - 7:00 PM)",
  });
  const [step, setStep] = useState("form"); // "form" | "otp" | "success"
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
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

  const handleVerifyOtp = async (code) => {
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(formData.phone, code);

      await api.post("/public/leads/demo", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course,
        source: "Demo Page",
        message: `Reserved demo trial for ${formData.course} (Date: ${formData.date || "Any"}, Slot: ${formData.slot}) [Mobile OTP Verified]`,
      });

      setStep("success");
      setIsSubmitted(true);
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

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <PlayCircle size={15} />
            100% Free Live Trial
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[13px]late-900 sm:text-5xl">
            Book a Free <span className="text-blue-600">Demo Class</span>
          </h1>
          <p className="mt-3 text-base text-[13px]late-600">
            Experience our interactive live classroom, code directly with senior
            mentors, and ask questions before deciding to enroll.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-[13px]late-900">
                What to Expect in Your Demo Class
              </h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Video size={20} />
                  </div>
                  <div>
                    <h3 className="text-[13px]m font-bold text-[13px]late-900">
                      Live 1-on-1 Interactive Coding
                    </h3>
                    <p className="mt-1 text-xs text-[13px]late-500">
                      Build a micro-project live with a senior developer who
                      explains every line of code.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-[13px]m font-bold text-[13px]late-900">
                      Personal Career Guidance
                    </h3>
                    <p className="mt-1 text-xs text-[13px]late-500">
                      Discuss your background, college year, or current role to
                      craft an ideal roadmap.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-[13px]m font-bold text-[13px]late-900">
                      Zero Financial Obligation
                    </h3>
                    <p className="mt-1 text-xs text-[13px]late-500">
                      No credit card or commitment required. The trial is 100% free.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-600/20">
              <h3 className="text-lg font-bold">Upcoming Batch Schedules</h3>
              <p className="mt-1 text-xs text-blue-100">
                Next batches begin this coming Monday. Book your trial early to
                reserve early bird scholarship seats.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
              {step === "form" && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Reserve Your Demo Slot
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Fill in your details and our team will send your private
                    session link via WhatsApp and email.
                  </p>

                  {error && (
                    <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (error) setError(null);
                        }}
                        placeholder="e.g. Priyanshu Sharma"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                          Phone / WhatsApp Number *
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
                          placeholder="student@example.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Target Course / Learning Path *
                      </label>
                      <select
                        value={formData.course}
                        onChange={(e) =>
                          setFormData({ ...formData, course: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        {coursesData.map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                          Preferred Time Slot
                        </label>
                        <select
                          value={formData.slot}
                          onChange={(e) =>
                            setFormData({ ...formData, slot: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="Morning (10:00 AM - 11:00 AM)">
                            Morning (10:00 AM - 11:00 AM)
                          </option>
                          <option value="Afternoon (2:00 PM - 3:00 PM)">
                            Afternoon (2:00 PM - 3:00 PM)
                          </option>
                          <option value="Evening (6:00 PM - 7:00 PM)">
                            Evening (6:00 PM - 7:00 PM)
                          </option>
                          <option value="Late Evening (8:00 PM - 9:00 PM)">
                            Late Evening (8:00 PM - 9:00 PM)
                          </option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-[#FD8006] py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {loading ? "Sending Verification OTP..." : "Confirm Free Demo Class Booking"}
                    </button>

                    <p className="text-center text-xs text-slate-400">
                      🔒 Your details are 100% confidential. No spam guaranteed.
                    </p>
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
                  subtitle="Please enter the 4-digit SMS OTP to confirm your demo class slot:"
                  submitLabel="Verify & Confirm Demo Slot"
                />
              )}

              {step === "success" && (
                <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    Demo Class Reserved!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-bold">{formData.name}</span>.
                    We have verified your phone and scheduled your demo class for &ldquo;
                    <span className="font-semibold text-blue-600">{formData.course}</span>
                    &rdquo;. Our academic coordinator will contact you at{" "}
                    <span className="font-bold">{formData.phone}</span> with your
                    live class meeting invitation.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setIsSubmitted(false);
                    }}
                    className="mt-6 rounded-xl bg-[#FD8006] px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Book Another Session
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

export default DemoClass;
