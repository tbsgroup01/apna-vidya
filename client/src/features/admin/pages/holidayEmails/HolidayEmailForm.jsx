import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Save,
  Mail,
  Clock,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Users,
  Eye,
  Sparkles,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { FormInput, FormSelect, FormTextarea } from "../../components/FormControls";
import api from "../../../../services/api";
import { useSettings } from "../../../../context/SettingsContext";
import defaultLogo from "../../../../assets/apnavidya.png";

const HolidayEmailForm = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const logoSrc = settings.general?.logoUrl || defaultLogo;

  const [formData, setFormData] = useState({
    holidayName: "Diwali Festivities & Holidays",
    date: new Date().toISOString().split("T")[0],
    subject: "Happy Diwali from Apna Vidya! Important Holiday & Class Schedule Update",
    recipients: "All Active Students",
    content:
      "Dear Students,\n\nWishing you and your loved ones a very Happy, Prosperous and Joyous Diwali!\n\nPlease note that all live interactive sessions will remain suspended during the holiday. Self-paced LMS learning videos, assignments, and coding challenges will continue to be accessible 24x7.\n\nRegular live classes and mentor office hours will resume as scheduled.\n\nWarm regards,\nAcademic Operations Team\nApna Vidya Academy",
  });

  const [audienceCounts, setAudienceCounts] = useState({
    active: 0,
    total: 0,
  });
  const [smtpStatus, setSmtpStatus] = useState({
    configured: true,
    fromEmail: "",
    fromName: "",
  });
  const [loading, setLoading] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showLivePreview, setShowLivePreview] = useState(true);

  useEffect(() => {
    fetchAudienceAndSettings();
  }, []);

  const fetchAudienceAndSettings = async () => {
    try {
      // 1. Fetch audience counts
      const resStats = await api.get("/admin/holiday-emails/audience-stats");
      if (resStats.data?.success && resStats.data?.data) {
        setAudienceCounts({
          active: resStats.data.data.activeStudents || 0,
          total: resStats.data.data.totalStudents || 0,
        });
      }

      // 2. Fetch email settings to verify SMTP credentials
      const resSettings = await api.get("/admin/settings");
      if (resSettings.data?.success && resSettings.data?.data?.email) {
        const emailConf = resSettings.data.data.email;
        const hasPass = Boolean(emailConf.gmailAppPassword && emailConf.gmailAppPassword.trim());
        const hasEmail = Boolean(emailConf.fromEmail && emailConf.fromEmail.includes("@"));

        setSmtpStatus({
          configured: hasPass && hasEmail,
          fromEmail: emailConf.fromEmail || "",
          fromName: emailConf.fromName || "Apna Vidya Academy",
        });
      }
    } catch (_) {
      // Non-critical, fallback gracefully
    }
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrorMsg("");
  };

  const handleSubmit = async (actionType) => {
    if (!formData.holidayName.trim()) {
      setErrorMsg("Please enter the holiday / occasion name.");
      return;
    }
    if (!formData.date) {
      setErrorMsg("Please select the holiday date.");
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMsg("Please enter an email subject line.");
      return;
    }
    if (!formData.content.trim()) {
      setErrorMsg("Please enter the email body message content.");
      return;
    }

    if (actionType === "send" && !smtpStatus.configured) {
      setErrorMsg(
        "Gmail SMTP credentials are not yet configured in Settings. Please configure your Gmail address and 16-character App Password first."
      );
      return;
    }

    try {
      setLoading(true);
      setSubmittingAction(actionType);
      setErrorMsg("");
      setSuccessMsg("");

      const payload = {
        ...formData,
        action: actionType,
      };

      const res = await api.post("/admin/holiday-emails", payload);

      if (res.data?.success) {
        setSuccessMsg(
          res.data.message ||
          (actionType === "send"
            ? "Holiday broadcast successfully dispatched in real-time to all students!"
            : "Holiday campaign saved successfully!")
        );

        setTimeout(() => {
          navigate("/admin/holiday-emails");
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
        "Failed to process holiday email broadcast. Please verify your SMTP settings."
      );
    } finally {
      setLoading(false);
      setSubmittingAction(null);
    }
  };

  const audienceOptions = [
    `All Active Students (${audienceCounts.active} students)`,
    `All Enrolled Students (${audienceCounts.total} students)`,
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Compose Holiday Broadcast"
        description="Draft and dispatch institution-wide festival greetings or holiday circulars in real-time to students."
        breadcrumbs={[
          { label: "Holiday Emails", path: "/admin/holiday-emails" },
          { label: "Compose" },
        ]}
        actions={
          <Link
            to="/admin/holiday-emails"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft size={15} />
            <span>Back to Broadcasts</span>
          </Link>
        }
      />

      {/* SMTP Credentials Status Notice */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border p-4 text-xs transition-all ${smtpStatus.configured
          ? "border-blue-200 bg-blue-50/70 text-blue-900"
          : "border-amber-200 bg-amber-50/80 text-amber-900"
          }`}
      >
        <div className="flex items-center gap-2.5">
          {smtpStatus.configured ? (
            <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          )}
          <div>
            <p className="font-bold">
              {smtpStatus.configured
                ? `Active SMTP Relay: ${smtpStatus.fromName} (${smtpStatus.fromEmail || "Configured"})`
                : "SMTP Credentials Missing in Settings"}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Broadcast credentials and Gmail socket parameters are fetched directly from{" "}
              <strong>Settings &gt; Email Configuration</strong>.
            </p>
          </div>
        </div>

        <Link
          to="/admin/settings?tab=email"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300/80 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all shrink-0"
        >
          <span>Verify Credentials</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 animate-in fade-in">
          <AlertTriangle size={18} className="text-rose-600 shrink-0" />
          <div className="flex-1">
            <span>{errorMsg}</span>
            {errorMsg.includes("Settings") && (
              <Link
                to="/admin/settings?tab=email"
                className="ml-2 font-bold underline text-rose-900 hover:text-black"
              >
                Open Settings &gt; Email Configuration
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Compose Form */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Mail size={16} />
              </div>
              <span>Email Campaign Details</span>
            </div>
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="lg:hidden text-xs text-blue-600 font-semibold"
            >
              {showLivePreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Holiday / Occasion Name *"
              required
              value={formData.holidayName}
              onChange={(e) => handleChange("holidayName", e.target.value)}
              placeholder="e.g. Diwali Festivities, Eid Mubarak, Independence Day"
            />
            <FormInput
              label="Holiday Date *"
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <FormSelect
            label="Target Audience Group *"
            value={formData.recipients}
            onChange={(e) => handleChange("recipients", e.target.value)}
            options={audienceOptions}
          />

          <FormInput
            label="Email Subject Line *"
            required
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="e.g. Warm Holiday Greetings from Apna Vidya!"
          />

          <FormTextarea
            label="Email Message Content *"
            rows={8}
            required
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            helperText="Personalized greeting 'Dear [Student Name]' is automatically injected at dispatch."
          />

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-slate-100">




            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("send")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 shadow-sm cursor-pointer disabled:opacity-50 transition-all"
            >
              {submittingAction === "send" ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Transmitting Real-Time...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Send Real-Time Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Interactive Student Email View Preview */}
        {showLivePreview && (
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Eye size={14} />
                <span>Live Student Inbox Preview</span>
              </div>
              <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                HTML Template
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                {/* Email Header - Clean white background, no blue, larger logo */}
                <div className="bg-white p-6 border-b border-slate-100 text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <img
                      src={logoSrc}
                      alt="Apna Vidya Logo"
                      className="h-14 sm:h-16 w-auto max-h-20 max-w-[280px] object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultLogo;
                      }}
                    />
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-blue-700 font-bold text-[11px]">
                    {formData.holidayName || "Holiday Notice"}
                  </div>

                  <p className="font-bold text-slate-800 text-xs">
                    Dear <span className="text-blue-600 font-mono">[Student Name]</span>,
                  </p>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Holiday:</span>
                      <span className="font-bold text-slate-900">{formData.holidayName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Date:</span>
                      <span className="font-bold text-blue-600">
                        {formData.date
                          ? new Date(formData.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50/60 p-3 text-slate-700 whitespace-pre-line leading-relaxed text-[11px] max-h-48 overflow-y-auto">
                    {formData.content}
                  </div>
                </div>

                {/* Email Footer */}
                <div className="border-t border-slate-100 bg-slate-50 p-3 text-center text-[10px] text-slate-400">
                  <p className="font-semibold text-slate-600">
                    {smtpStatus.fromName || "Apna Vidya Academy"}
                  </p>
                  <p className="mt-0.5">Transmitted in real-time to enrolled students.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayEmailForm;
