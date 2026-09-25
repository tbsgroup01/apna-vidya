import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
  Upload,
  Trash2,
  Sparkles,
  RefreshCw,
  Briefcase,
  FileText,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { FormInput, FormTextarea } from "../components/FormControls";
import { adminProfileData } from "../../../data/admin/settingsData";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
];

const AdminProfile = () => {
  const { user, updateProfile, changePassword, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: user?.name || adminProfileData.name,
    email: user?.email || adminProfileData.email,
    phone: user?.phone || adminProfileData.phone || "",
    role: user?.role || adminProfileData.role || "Admin",
    avatar: user?.profileImage || adminProfileData.avatar,
    bio: user?.bio || adminProfileData.bio || "",
    designation: user?.designation || adminProfileData.designation || "Director of Institutional Operations",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone !== undefined && user.phone !== null ? user.phone : prev.phone,
        role: user.role || prev.role,
        avatar: user.profileImage || prev.avatar,
        bio: user.bio !== undefined && user.bio !== null ? user.bio : prev.bio,
        designation: user.designation !== undefined && user.designation !== null ? user.designation : prev.designation,
      }));
    }
  }, [user]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)) {
      setUploadError("Please choose a valid image file (JPG, PNG, WebP, SVG).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError("Image size must be smaller than 8MB.");
      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      let res;
      try {
        res = await api.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (adminErr) {
        res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const uploadedUrl = res.data?.url || res.data?.data?.url;
      if (uploadedUrl) {
        setProfile((prev) => ({ ...prev, avatar: uploadedUrl }));
      } else {
        const localBlob = URL.createObjectURL(file);
        setProfile((prev) => ({ ...prev, avatar: localBlob }));
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfile((prev) => ({ ...prev, avatar: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSaved(false);

    if (!profile.name.trim()) {
      setProfileError("Full Name is required.");
      return;
    }

    setProfileLoading(true);

    try {
      const payload = {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        bio: profile.bio.trim(),
        designation: profile.designation.trim(),
        profileImage: profile.avatar,
      };

      const result = await updateProfile(payload);
      setProfileLoading(false);

      if (result.success) {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3500);
      } else {
        setProfileError(result.message || "Failed to update profile.");
      }
    } catch (err) {
      setProfileLoading(false);
      setProfileError(err.response?.data?.message || err.message || "Failed to save profile changes.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (passwordForm.newPass !== passwordForm.confirmPass) {
      setPasswordError("New password and confirmation password do not match.");
      return;
    }

    if (passwordForm.newPass.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(
      passwordForm.current,
      passwordForm.newPass,
      passwordForm.confirmPass
    );
    setPasswordLoading(false);

    if (result.success) {
      setPasswordSaved(true);
      setPasswordForm({ current: "", newPass: "", confirmPass: "" });
      setTimeout(() => setPasswordSaved(false), 3500);
    } else {
      setPasswordError(result.message || "Failed to update password.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Admin Profile"
        description="Manage your institutional identity, administrative credentials, photo, and secure access permissions in real time."
        breadcrumbs={[{ label: "Admin Profile" }]}
      />

      {profileSaved && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 p-4 text-xs font-bold text-emerald-800 shadow-xs animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Profile changes saved and synchronized across the system in real time!</span>
        </div>
      )}

      {profileError && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200/90 p-4 text-xs font-bold text-rose-800 shadow-xs animate-in fade-in">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{profileError}</span>
        </div>
      )}

      {passwordSaved && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 p-4 text-xs font-bold text-emerald-800 shadow-xs animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Security password updated successfully!</span>
        </div>
      )}

      {passwordError && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200/90 p-4 text-xs font-bold text-rose-800 shadow-xs animate-in fade-in">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{passwordError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs text-center">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

            <div className="relative mx-auto mt-2 inline-block">
              <img
                src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={profile.name}
                className="h-28 w-28 rounded-3xl object-cover ring-4 ring-blue-100 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload Photo"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {uploading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
              </button>
            </div>

            <h3 className="mt-4 text-lg font-black text-slate-900 tracking-tight">
              {profile.name || "Administrator"}
            </h3>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {profile.role || "Admin"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {profile.designation || "Director of Institutional Operations"}
            </p>

            <div className="mt-5 border-t border-slate-100 pt-4 space-y-2.5 text-left text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Mail size={13} />
                </div>
                <span className="truncate font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Phone size={13} />
                </div>
                <span className="font-medium">{profile.phone || "No phone added"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={13} />
                </div>
                <span className="font-bold text-emerald-700">Enterprise Role Security</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Upload size={14} />
                <span>{uploading ? "Uploading..." : "Upload New Photo"}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <form
            onSubmit={handleProfileSubmit}
            className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <User size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Personal & Administrative Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live database records powering all portals and activity stamps
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Full Name *"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Dr. Rajesh Sharma"
              />
              <FormInput
                label="Email Address (Locked)"
                type="email"
                disabled
                value={profile.email}
                helperText="Official system login credential"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Direct Phone / WhatsApp"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
              <FormInput
                label="Designation / Official Title"
                value={profile.designation}
                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                placeholder="e.g. Director of Academic Programs"
              />
            </div>

            <FormTextarea
              label="Professional Bio"
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Brief professional profile, academic background, and administrative responsibilities..."
            />

            <div className="space-y-3 pt-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Profile Avatar Photo
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                  <img
                    src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                      <RefreshCw size={16} className="animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-95 shadow-xs transition-all cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>{uploading ? "Uploading..." : "Browse Photo"}</span>
                    </button>
                    {profile.avatar && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, avatar: "" })}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Upload PNG, JPG, or WebP up to 8MB. Updates your profile across the portal immediately.
                  </p>
                </div>
              </div>

              {uploadError && (
                <p className="text-xs font-semibold text-rose-600">{uploadError}</p>
              )}

              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 mb-2">Or pick from preset avatars:</p>
                <div className="flex items-center gap-2.5">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfile({ ...profile, avatar: preset })}
                      className={`h-10 w-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        profile.avatar === preset
                          ? "border-blue-600 ring-2 ring-blue-200 scale-105"
                          : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={profileLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {profileLoading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                <span>{profileLoading ? "Saving Real-Time..." : "Save Profile Changes"}</span>
              </button>
            </div>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600" />

            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Lock size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Change Security Password</h3>
                <p className="text-xs text-slate-500">Update your administrative access credentials</p>
              </div>
            </div>

            <FormInput
              label="Current Password *"
              type="password"
              required
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
              placeholder="••••••••"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="New Password *"
                type="password"
                required
                value={passwordForm.newPass}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPass: e.target.value })
                }
                placeholder="At least 6 characters"
              />
              <FormInput
                label="Confirm New Password *"
                type="password"
                required
                value={passwordForm.confirmPass}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPass: e.target.value })
                }
                placeholder="Re-enter new password"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 active:scale-95 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
              >
                {passwordLoading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Lock size={15} />
                )}
                <span>{passwordLoading ? "Updating..." : "Update Security Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
