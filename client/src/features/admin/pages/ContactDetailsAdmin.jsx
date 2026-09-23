import React, { useState } from "react";
import {
  PhoneCall,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  Share2,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { FormInput, FormTextarea } from "../components/FormControls";
import { initialContactCMS } from "../../../data/admin/cmsData";

const ContactDetailsAdmin = ({ isEmbedded = false }) => {
  const [data, setData] = useState(initialContactCMS);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, val) => {
    setData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSocialChange = (net, val) => {
    setData((prev) => ({
      ...prev,
      social: { ...prev.social, [net]: val },
    }));
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={isEmbedded ? "space-y-6" : "space-y-6 max-w-5xl mx-auto"}>
      {!isEmbedded && (
        <PageHeader
          title="Contact Details CMS"
          description="Configure institutional helpline telephone numbers, support emails, headquarters address, and official social media handles."
          breadcrumbs={[{ label: "Contact Details" }]}
        />
      )}

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Contact info updated successfully across the platform!</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <PhoneCall size={18} className="text-blue-600" />
              <span>Helpline & Communication Channels</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Primary Phone Number *"
                required
                value={data.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <FormInput
                label="Alternate Helpline"
                value={data.alternatePhone}
                onChange={(e) => handleChange("alternatePhone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Admissions Email *"
                type="email"
                required
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <FormInput
                label="Student Support Email *"
                type="email"
                required
                value={data.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
              />
            </div>

            <FormInput
              label="WhatsApp Admissions Number"
              value={data.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
            />

            <FormTextarea
              label="Campus Address *"
              rows={2}
              required
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />

            <FormInput
              label="Working Hours *"
              value={data.workingHours}
              onChange={(e) => handleChange("workingHours", e.target.value)}
            />

            <FormInput
              label="Google Maps Location URL"
              value={data.googleMapsUrl}
              onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <Share2 size={18} className="text-indigo-600" />
              <span>Official Social Media Profiles</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Facebook Page"
                value={data.social.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
              />
              <FormInput
                label="Instagram Handle"
                value={data.social.instagram}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
              />
              <FormInput
                label="LinkedIn Organization"
                value={data.social.linkedin}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
              />
              <FormInput
                label="YouTube Channel"
                value={data.social.youtube}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Save size={16} />
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Website Preview Card
          </p>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
                AV
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Apna Vidya Contact</h4>
                <p className="text-[11px] text-slate-400">{data.workingHours}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-blue-600 shrink-0" />
                <span className="font-mono font-bold text-slate-900">{data.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-blue-600 shrink-0" />
                <span className="text-slate-800 truncate">{data.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-snug">{data.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-blue-600 shrink-0" />
                <span className="text-slate-700">{data.workingHours}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">
                Connected Social Handles
              </p>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">Facebook</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">Instagram</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">LinkedIn</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">YouTube</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsAdmin;
