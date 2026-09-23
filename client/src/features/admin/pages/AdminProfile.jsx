import React, { useState } from "react";
import { User, Mail, Phone, ShieldCheck, Lock, Save, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { FormInput, FormTextarea, ImageUploadPreview } from "../components/FormControls";
import { adminProfileData } from "../../../data/admin/settingsData";
import { useAuth } from "../../../context/AuthContext";

const AdminProfile = () => {
  const { user, changePassword } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || adminProfileData.name,
    email: user?.email || adminProfileData.email,
    phone: user?.phone || adminProfileData.phone,
    role: user?.role || adminProfileData.role,
    avatar: user?.profileImage || adminProfileData.avatar,
    bio: adminProfileData.bio,
    designation: adminProfileData.designation,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (passwordForm.newPass !== passwordForm.confirmPass) {
      setPasswordError("New password and confirmation password do not match.");
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
      setTimeout(() => setPasswordSaved(false), 3000);
    } else {
      setPasswordError(result.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Admin Profile"
        description="Manage your institutional identity, contact info, personal bio, and secure access credentials."
        breadcrumbs={[{ label: "Admin Profile" }]}
      />

      {profileSaved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {passwordSaved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>Password changed successfully!</span>
        </div>
      )}

      {passwordError && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700 animate-in fade-in">
          <span>{passwordError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs text-center">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-24 w-24 rounded-full object-cover mx-auto ring-4 ring-blue-50"
            />
            <h3 className="mt-4 font-bold text-slate-900 text-base">{profile.name}</h3>
            <p className="text-xs text-blue-600 font-semibold">{profile.role}</p>
            <p className="text-[11px] text-slate-400 mt-1">{profile.designation}</p>

            <div className="mt-5 border-t border-slate-100 pt-4 space-y-2 text-left text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span className="truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="font-semibold text-emerald-700">Two-Factor Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <form
            onSubmit={handleProfileSubmit}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <User size={18} className="text-blue-600" />
              <span>Personal & Administrative Details</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Full Name *"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <FormInput
                label="Email Address (Locked)"
                type="email"
                disabled
                value={profile.email}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
              <FormInput
                label="Assigned System Role"
                disabled
                value={profile.role}
              />
            </div>

            <FormTextarea
              label="Professional Bio"
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />

            <ImageUploadPreview
              label="Profile Avatar Picture"
              value={profile.avatar}
              onChange={(url) => setProfile({ ...profile, avatar: url })}
              aspect="square"
              helperText="Personal photo displayed across admin header and activity logs"
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 shadow-sm cursor-pointer"
              >
                <Save size={15} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 text-slate-900 font-bold text-sm">
              <Lock size={18} className="text-indigo-600" />
              <span>Change Security Password</span>
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

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 active:scale-95 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Lock size={15} />
                <span>{passwordLoading ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
