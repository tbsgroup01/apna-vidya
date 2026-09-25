import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Settings,
  PhoneCall,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Code2,
  Search,
  Building2,
  Share2,
  Phone,
  MapPin,
  Clock,
  KeyRound,
  ExternalLink,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { FormInput, FormTextarea, ImageUploadPreview } from "../components/FormControls";
import api from "../../../services/api";

const DEFAULT_SETTINGS = {
  general: {
    siteName: "Apna Vidya",
    tagline: "Learn • Grow • Succeed",
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico",
  },
  seo: {
    metaTitle: "Apna Vidya - Learn • Grow • Succeed | Leading Tech Education",
    metaDescription: "Master Full Stack Development, Data Science, Python, and DSA with live 1-on-1 mentoring, verified certifications, and guaranteed career support.",
    keywords: "coding bootcamp, web development, data science, apna vidya, full stack course, learn react, python dsa",
    ogImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  customTags: [],
  contact: {
    phone: "+91 98765 43210",
    alternatePhone: "+91 98111 22334",
    email: "admissions@apnavidya.com",
    supportEmail: "support@apnavidya.com",
    whatsapp: "+91 98765 43210",
    address: "Apna Vidya Tower, 4th Floor, Sector 62, Noida, UP - 201301",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
    googleMapsUrl: "https://maps.google.com/?q=Noida+Sector+62",
    social: {
      facebook: "https://facebook.com/apnavidya",
      instagram: "https://instagram.com/apnavidya_official",
      linkedin: "https://linkedin.com/company/apna-vidya",
      youtube: "https://youtube.com/@apnavidya",
      twitter: "https://twitter.com/apnavidya",
    },
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    encryption: "SSL",
    fromEmail: "notifications@apnavidya.com",
    fromName: "Apna Vidya Academy",
    gmailAppPassword: "",
  },
};

const SettingsAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = ["general", "contact", "email", "security"];
  const initialTab = validTabs.includes(tabParam) ? tabParam : "general";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError, setSaveError] = useState("");

  const [newTag, setNewTag] = useState({
    name: "",
    placement: "head",
    code: "",
  });
  const [tagError, setTagError] = useState("");

  const [showAppPassword, setShowAppPassword] = useState(false);
  const [testRecipient, setTestRecipient] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/settings");
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        setSettings({
          general: { ...DEFAULT_SETTINGS.general, ...(d.general || {}) },
          seo: { ...DEFAULT_SETTINGS.seo, ...(d.seo || {}) },
          customTags: Array.isArray(d.customTags) ? d.customTags : [],
          contact: {
            ...DEFAULT_SETTINGS.contact,
            ...(d.contact || {}),
            social: { ...DEFAULT_SETTINGS.contact.social, ...(d.contact?.social || {}) },
          },
          email: { ...DEFAULT_SETTINGS.email, ...(d.email || {}) },
        });
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to load platform settings");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setSaveSuccess("");
    setSaveError("");
    setTestEmailResult(null);
    setPasswordStatus(null);
  };

  const handleNestedChange = (section, field, val) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: val,
      },
    }));
  };

  const handleSocialChange = (network, val) => {
    setSettings((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        social: {
          ...prev.contact.social,
          [network]: val,
        },
      },
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.name.trim()) {
      setTagError("Please provide a name or label for this tag.");
      return;
    }
    if (!newTag.code.trim()) {
      setTagError("Please enter the HTML tag or script code.");
      return;
    }
    setTagError("");
    const tagItem = {
      id: Date.now().toString(),
      name: newTag.name.trim(),
      placement: newTag.placement || "head",
      code: newTag.code.trim(),
      active: true,
    };
    setSettings((prev) => ({
      ...prev,
      customTags: [...(prev.customTags || []), tagItem],
    }));
    setNewTag({ name: "", placement: "head", code: "" });
  };

  const handleDeleteTag = (id) => {
    setSettings((prev) => ({
      ...prev,
      customTags: (prev.customTags || []).filter((t) => t.id !== id),
    }));
  };

  const handleToggleTag = (id) => {
    setSettings((prev) => ({
      ...prev,
      customTags: (prev.customTags || []).map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      ),
    }));
  };

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaving(true);
    setSaveSuccess("");
    setSaveError("");

    try {
      const res = await api.put("/admin/settings", settings);
      if (res.data?.success) {
        window.dispatchEvent(
          new CustomEvent("apna_settings_updated", { detail: res.data.data })
        );
        try {
          localStorage.setItem("apna_settings_sync", Date.now().toString());
        } catch (_) { }
        setSaveSuccess("System settings successfully saved and synced with database!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testRecipient.trim() || !testRecipient.includes("@")) {
      setTestEmailResult({
        success: false,
        message: "Please enter a valid recipient email address.",
      });
      return;
    }

    setTestingEmail(true);
    setTestEmailResult(null);

    try {
      const payload = {
        toEmail: testRecipient.trim(),
        smtpHost: settings.email.smtpHost,
        smtpPort: settings.email.smtpPort,
        encryption: settings.email.encryption,
        fromEmail: settings.email.fromEmail,
        fromName: settings.email.fromName,
        gmailAppPassword: settings.email.gmailAppPassword,
      };
      const res = await api.post("/admin/settings/test-email", payload);
      setTestEmailResult({
        success: true,
        message: res.data?.message || `Test email sent successfully to ${testRecipient}!`,
      });
    } catch (err) {
      setTestEmailResult({
        success: false,
        message: err.response?.data?.message || "Failed to establish SMTP connection. Please verify your Gmail App Password.",
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!passwordForm.currentPassword) {
      setPasswordStatus({ success: false, message: "Current password is required." });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        success: false,
        message: "New password and confirm password do not match.",
      });
      return;
    }

    setPasswordUpdating(true);

    try {
      const res = await api.put("/admin/settings/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      if (res.data?.success) {
        setPasswordStatus({
          success: true,
          message: "Administrator password updated successfully! Please use your new credentials on your next login.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setPasswordStatus({
        success: false,
        message: err.response?.data?.message || "Failed to update password. Please check your current password.",
      });
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-xs font-semibold text-[13px]late-500">Loading platform settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Platform & System Settings"
        description="Configure institution branding, global SEO tags, helpline contact coordinates, automated Gmail SMTP relays, and security credentials."
        breadcrumbs={[{ label: "Settings" }]}
      />

      {saveSuccess && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 animate-in fade-in">
          <AlertTriangle size={18} className="text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: "general", label: "General & SEO", icon: Settings, badge: "Branding • Tags" },
          { id: "contact", label: "Contact Details", icon: PhoneCall, badge: "Public Info" },
          { id: "email", label: "Email Configuration", icon: Mail, badge: "Gmail SMTP" },
          { id: "security", label: "Security", icon: ShieldCheck, badge: "Password" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${isActive
                ? "border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-xl"
                : "border-transparent text-[13px]late-500 hover:text-[13px]late-900 hover:bg-slate-50 rounded-t-xl"
                }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span
                className={`hidden sm:inline-block rounded-full px-2 py-0.5 text-[12px] font-semibold ${isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-[13px]late-500"
                  }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-[13px]m font-bold text-[13px]late-900">Institution Branding & Identity</h3>
                  <p className="text-xs text-[13px]late-400">Configure institutional marks, platform motto, header logos, and favicon URLs.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Institution Name *"
                required
                value={settings.general.siteName}
                onChange={(e) => handleNestedChange("general", "siteName", e.target.value)}
              />
              <FormInput
                label="Motto / Tagline"
                value={settings.general.tagline}
                onChange={(e) => handleNestedChange("general", "tagline", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-2">
              <div>
                <ImageUploadPreview
                  label="Platform Header Logo"
                  value={settings.general.logoUrl}
                  onChange={(url) => handleNestedChange("general", "logoUrl", url)}
                  aspect="auto"
                  helperText="Primary branding logo displayed in the website navigation bar"
                />
              </div>

              <div>
                <ImageUploadPreview
                  label="Browser Favicon Icon"
                  value={settings.general.faviconUrl}
                  onChange={(url) => handleNestedChange("general", "faviconUrl", url)}
                  aspect="square"
                  helperText="Renders in browser address bar and bookmark tabs (ICO, PNG, SVG)"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Search size={18} />
              </div>
              <div>
                <h3 className="text-[13px]m font-bold text-[13px]late-900">Search Engine Optimization (SEO)</h3>
                <p className="text-xs text-[13px]late-400">Meta tags and Open Graph representations indexed by search engines and social scrapers.</p>
              </div>
            </div>

            <FormInput
              label="Default Website Meta Title"
              value={settings.seo.metaTitle}
              onChange={(e) => handleNestedChange("seo", "metaTitle", e.target.value)}
              helperText={`${settings.seo.metaTitle?.length || 0} characters (Recommended: 50-60 characters)`}
            />

            <FormTextarea
              label="Meta Description"
              rows={3}
              value={settings.seo.metaDescription}
              onChange={(e) => handleNestedChange("seo", "metaDescription", e.target.value)}
              helperText={`${settings.seo.metaDescription?.length || 0} characters (Recommended: 150-160 characters)`}
            />

            <FormInput
              label="Global Keywords (Comma-separated)"
              value={settings.seo.keywords}
              onChange={(e) => handleNestedChange("seo", "keywords", e.target.value)}
              placeholder="coding bootcamp, web development, apna vidya, full stack course"
            />

            <ImageUploadPreview
              label="Social Share Open Graph (OG) Image"
              value={settings.seo.ogImage}
              onChange={(url) => handleNestedChange("seo", "ogImage", url)}
              aspect="video"
              helperText="Card preview image displayed when links are shared across social platforms"
            />
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Code2 size={18} />
                </div>
                <div>
                  <h3 className="text-[13px]m font-bold text-[13px]late-900">Custom Meta & Script Tags Injector</h3>
                  <p className="text-xs text-[13px]late-400">Inject custom &lt;meta&gt;, &lt;script&gt;, or analytics tags into platform &lt;head&gt; or &lt;body&gt;.</p>
                </div>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                {(settings.customTags || []).length} Tags Active
              </span>
            </div>



            {tagError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                <AlertTriangle size={15} />
                <span>{tagError}</span>
              </div>
            )}

            <form onSubmit={handleAddTag} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                    Tag Label / Identifier *
                  </label>
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                    placeholder="e.g. Google Analytics GA4, Canonical Tag, Meta Verification"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                    Placement Target *
                  </label>
                  <select
                    value={newTag.placement}
                    onChange={(e) => setNewTag({ ...newTag, placement: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-800 focus:border-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="head">&lt;head&gt; (Header)</option>
                    <option value="body">&lt;body&gt; (Body / Footer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                  Tag / Script HTML Content *
                </label>
                <textarea
                  rows={3}
                  value={newTag.code}
                  onChange={(e) => setNewTag({ ...newTag, code: e.target.value })}
                  placeholder={'<meta name="google-site-verification" content="XYZ..." />\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-..." defer></script>'}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-xs text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add Meta Tag</span>
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[13px]late-400">
                Configured Tags List ({(settings.customTags || []).length})
              </h4>

              {(settings.customTags || []).length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/40">
                  <Code2 size={24} className="mx-auto text-[13px]late-300 mb-2" />
                  <p className="text-xs font-semibold text-[13px]late-600">No custom meta or script tags configured yet.</p>
                  <p className="text-[13px] text-[13px]late-400 mt-0.5">Add tracking codes or verification tags using the form above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {settings.customTags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`rounded-xl border p-4 transition-all ${tag.active !== false
                        ? "border-slate-200 bg-white shadow-2xs"
                        : "border-slate-200 bg-slate-50/70 opacity-60"
                        }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 font-mono text-[12px] font-bold uppercase tracking-wider ${tag.placement === "head"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                              }`}
                          >
                            &lt;{tag.placement}&gt;
                          </span>
                          <span className="text-xs font-bold text-[13px]late-900">{tag.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleTag(tag.id)}
                            className={`rounded-lg px-2.5 py-1 text-[13px] font-semibold transition-colors cursor-pointer ${tag.active !== false
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-200 text-[13px]late-700 hover:bg-slate-300"
                              }`}
                          >
                            {tag.active !== false ? "Active" : "Disabled"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTag(tag.id)}
                            className="rounded-lg p-1.5 text-[13px]late-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove tag"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-[13px] font-mono text-emerald-400 leading-relaxed max-h-28">
                        <code>{tag.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveSettings}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? "Saving Changes..." : "Save General Settings"}</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <form onSubmit={handleSaveSettings} className="space-y-6 lg:col-span-7">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-[13px]late-900 font-bold text-[13px]m">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span>Helpline & Communication Channels</span>
                    <p className="text-xs font-normal text-[13px]late-400">Institutional telephone numbers, emails, and address.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Primary Phone Number *"
                    required
                    value={settings.contact.phone}
                    onChange={(e) => handleNestedChange("contact", "phone", e.target.value)}
                  />
                  <FormInput
                    label="Alternate Helpline"
                    value={settings.contact.alternatePhone}
                    onChange={(e) => handleNestedChange("contact", "alternatePhone", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Admissions Email *"
                    type="email"
                    required
                    value={settings.contact.email}
                    onChange={(e) => handleNestedChange("contact", "email", e.target.value)}
                  />
                  <FormInput
                    label="Student Support Email *"
                    type="email"
                    required
                    value={settings.contact.supportEmail}
                    onChange={(e) => handleNestedChange("contact", "supportEmail", e.target.value)}
                  />
                </div>

                <FormInput
                  label="WhatsApp Admissions Number"
                  value={settings.contact.whatsapp}
                  onChange={(e) => handleNestedChange("contact", "whatsapp", e.target.value)}
                  placeholder="+91 98765 43210"
                />

                <FormTextarea
                  label="Campus Headquarters Address *"
                  rows={2}
                  required
                  value={settings.contact.address}
                  onChange={(e) => handleNestedChange("contact", "address", e.target.value)}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Operating Working Hours *"
                    required
                    value={settings.contact.workingHours}
                    onChange={(e) => handleNestedChange("contact", "workingHours", e.target.value)}
                  />
                  <FormInput
                    label="Google Maps Location URL"
                    value={settings.contact.googleMapsUrl}
                    onChange={(e) => handleNestedChange("contact", "googleMapsUrl", e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-[13px]late-900 font-bold text-[13px]m">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Share2 size={18} />
                  </div>
                  <div>
                    <span>Official Social Media Handles</span>
                    <p className="text-xs font-normal text-[13px]late-400">Institutional community handles displayed across header and footer.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Facebook Page URL"
                    value={settings.contact.social?.facebook || ""}
                    onChange={(e) => handleSocialChange("facebook", e.target.value)}
                  />
                  <FormInput
                    label="Instagram Profile URL"
                    value={settings.contact.social?.instagram || ""}
                    onChange={(e) => handleSocialChange("instagram", e.target.value)}
                  />
                  <FormInput
                    label="LinkedIn Organization URL"
                    value={settings.contact.social?.linkedin || ""}
                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  />
                  <FormInput
                    label="YouTube Channel URL"
                    value={settings.contact.social?.youtube || ""}
                    onChange={(e) => handleSocialChange("youtube", e.target.value)}
                  />
                </div>

                <FormInput
                  label="Twitter / X Profile URL"
                  value={settings.contact.social?.twitter || ""}
                  onChange={(e) => handleSocialChange("twitter", e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save Contact Details"}</span>
                </button>
              </div>
            </form>

            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[13px]late-400">
                Live Public Card Preview
              </p>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-[13px]m shadow-sm">
                    AV
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px]late-900 text-[13px]m">{settings.general.siteName}</h4>
                    <p className="text-[13px] text-[13px]late-400">{settings.contact.workingHours}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-[13px]late-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3">
                    <Phone size={15} className="text-blue-600 shrink-0" />
                    <span className="font-mono font-bold text-[13px]late-900">{settings.contact.phone}</span>
                  </div>
                  {settings.contact.alternatePhone && (
                    <div className="flex items-center gap-3">
                      <Phone size={15} className="text-[13px]late-400 shrink-0" />
                      <span className="font-mono text-[13px]late-600">{settings.contact.alternatePhone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Mail size={15} className="text-blue-600 shrink-0" />
                    <span className="text-[13px]late-800 truncate">{settings.contact.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-[13px]late-700 leading-snug">{settings.contact.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={15} className="text-blue-600 shrink-0" />
                    <span className="text-[13px]late-700">{settings.contact.workingHours}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[13px] font-bold text-[13px]late-400 uppercase mb-2">
                    Connected Social Channels
                  </p>
                  <div className="flex flex-wrap gap-2 text-[13px]">
                    {Object.entries(settings.contact.social || {}).map(([key, val]) => (
                      <span
                        key={key}
                        className={`rounded-md px-2.5 py-1 font-semibold capitalize ${val ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-slate-100 text-[13px]late-400"
                          }`}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "email" && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className="text-[13px]m font-bold text-[13px]late-900">Gmail App SMTP Relay Configuration</h3>
                    <p className="text-xs text-[13px]late-400">Configure automated notification delivery using Google Gmail App Passwords.</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  Gmail TLS Relay
                </span>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <HelpCircle size={16} className="text-amber-600 shrink-0" />
                  <span>How to generate a Gmail App Password:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-amber-800 text-[12px] pl-1">
                  <li>Ensure <strong>2-Step Verification</strong> is enabled in your Google Account.</li>
                  <li>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="underline font-bold text-amber-950 inline-flex items-center gap-1">Google App Passwords <ExternalLink size={11} /></a>.</li>
                  <li>Type an App name (e.g. <em>Apna Vidya Portal</em>) and click <strong>Create</strong>.</li>
                  <li>Copy the 16-character password (e.g. <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-bold">abcd efgh ijkl mnop</span>) and paste it below.</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormInput
                  label="SMTP Host Address"
                  value={settings.email.smtpHost}
                  onChange={(e) => handleNestedChange("email", "smtpHost", e.target.value)}
                  placeholder="smtp.gmail.com"
                />

                <FormInput
                  label="SMTP Port"
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) => handleNestedChange("email", "smtpPort", Number(e.target.value))}
                  placeholder="465 (SSL) or 587 (TLS)"
                />

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                    Encryption Protocol
                  </label>
                  <select
                    value={settings.email.encryption || "SSL"}
                    onChange={(e) => handleNestedChange("email", "encryption", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[13px]late-800 focus:border-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="SSL">SSL / Direct TLS (Port 465)</option>
                    <option value="TLS">STARTTLS (Port 587)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Sender Gmail Address *"
                  type="email"
                  required
                  value={settings.email.fromEmail}
                  onChange={(e) => handleNestedChange("email", "fromEmail", e.target.value)}
                  placeholder="institution@gmail.com"
                />

                <FormInput
                  label="Sender Display Name *"
                  required
                  value={settings.email.fromName}
                  onChange={(e) => handleNestedChange("email", "fromName", e.target.value)}
                  placeholder="Apna Vidya Academy"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                  Gmail 16-Character App Password *
                </label>
                <div className="relative">
                  <input
                    type={showAppPassword ? "text" : "password"}
                    value={settings.email.gmailAppPassword || ""}
                    onChange={(e) => handleNestedChange("email", "gmailAppPassword", e.target.value)}
                    placeholder="•••• •••• •••• •••• (16-letter App Password)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 font-mono text-[13px]m tracking-wider text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAppPassword(!showAppPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
                  >
                    {showAppPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-1 text-[13px] text-[13px]late-400">
                  Spaces are automatically trimmed during email socket dispatch.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save SMTP Settings"}</span>
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-blue-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Send size={16} />
              </div>
              <div>
                <h3 className="text-[13px]m font-bold text-[13px]late-900">Test Email Configuration & Socket Verification</h3>
                <p className="text-xs text-[13px]late-500">Send an instant test email to verify Gmail credentials and TLS handshake.</p>
              </div>
            </div>

            {testEmailResult && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs font-semibold animate-in fade-in ${testEmailResult.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
              >
                {testEmailResult.success ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{testEmailResult.success ? "Success!" : "Connection Failed"}</p>
                  <p className="font-normal text-[13px] mt-0.5">{testEmailResult.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  required
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="Enter recipient email address (e.g. your-email@gmail.com)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={testingEmail}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-black active:scale-95 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                {testingEmail ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Testing Handshake...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <KeyRound size={18} />
              </div>
              <div>
                <h3 className="text-[13px]m font-bold text-[13px]late-900">Administrator Password Management</h3>
                <p className="text-xs text-[13px]late-400">Change your administrator account password to secure portal access.</p>
              </div>
            </div>

            {passwordStatus && (
              <div
                className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs font-semibold animate-in fade-in ${passwordStatus.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
              >
                {passwordStatus.success ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{passwordStatus.success ? "Password Updated" : "Update Failed"}</p>
                  <p className="font-normal text-[13px] mt-0.5">{passwordStatus.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter your existing password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[13px]m text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[13px]m text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-[13px]m text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]late-400 hover:text-[13px]late-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-[13px] text-[13px]late-600">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${passwordForm.newPassword.length >= 6 ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                  />
                  <span>Minimum 6 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${passwordForm.newPassword &&
                      passwordForm.newPassword === passwordForm.confirmPassword
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                      }`}
                  />
                  <span>New password and confirmation match</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <KeyRound size={16} />
                  <span>{passwordUpdating ? "Updating Password..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsAdmin;
