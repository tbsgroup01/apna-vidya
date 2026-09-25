import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Save, Mail, Clock } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { FormInput, FormSelect, FormTextarea } from "../../components/FormControls";

const HolidayEmailForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    holidayName: "Diwali Festivities & Holidays",
    date: "2026-11-01",
    subject: "Happy Diwali from Apna Vidya! Important Holiday & Class Schedule Update",
    recipients: "All Active Students",
    content:
      "Dear Students,\n\nWishing you and your loved ones a very Happy, Prosperous and Joyous Diwali!\n\nPlease note that all live interactive sessions will remain suspended from November 1st to November 4th. Self-paced LMS learning videos, assignments, and coding challenges will continue to be accessible 24x7.\n\nRegular live classes resume on Thursday, November 5th.\n\nWarm regards,\nAcademic Operations Team\nApna Vidya Academy",
  });

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (actionType) => {
    navigate("/admin/holiday-emails");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Compose Holiday Broadcast"
        description="Draft and schedule institution-wide holiday greetings or class suspension notices."
        breadcrumbs={[
          { label: "Holiday Emails", path: "/admin/holiday-emails" },
          { label: "Compose" },
        ]}
        actions={
          <Link
            to="/admin/holiday-emails"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </Link>
        }
      />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-[13px]late-900 font-bold text-[13px]m">
          <Mail size={18} className="text-blue-600" />
          <span>Email Campaign Details</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="Holiday / Occasion Name *"
            required
            value={formData.holidayName}
            onChange={(e) => handleChange("holidayName", e.target.value)}
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
          options={[
            "All Active Students (1,420)",
            "All Students & Alumni (5,248)",
            "Full Stack Web Development Students (1,840)",
            "Data Science & AI Students (980)",
            "Weekend Batches Only (620)",
          ]}
        />

        <FormInput
          label="Email Subject Line *"
          required
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        />

        <FormTextarea
          label="Email Message Content *"
          rows={8}
          required
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
        />

        <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("schedule")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer"
          >
            <Clock size={14} />
            <span>Schedule for Holiday</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("send")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 shadow-sm cursor-pointer"
          >
            <Send size={14} />
            <span>Send Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolidayEmailForm;
