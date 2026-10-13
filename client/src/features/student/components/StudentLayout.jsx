import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  LogOut,
  Bell,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useSettings, sanitizeAssetUrl } from "../../../context/SettingsContext";
import defaultLogo from "../../../assets/apnavidya.png";

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const logoSrc = sanitizeAssetUrl(settings.general?.logoUrl, defaultLogo);
  const siteName = settings.general?.siteName || "APNAVIDYA";
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/student/dashboard", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[13px]late-900">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/student/dashboard" className="flex items-center gap-3 group" aria-label={`${siteName} Student Portal`}>
              <img
                src={logoSrc}
                alt={`${siteName} Logo`}
                onError={(e) => {
                  if (e.currentTarget.src !== defaultLogo) {
                    e.currentTarget.src = defaultLogo;
                  }
                }}
                className="h-10 sm:h-11 w-auto max-w-[180px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                <Sparkles size={10} />
                Student Portal
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/student/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-[13px]late-600 hover:bg-slate-100 hover:text-[13px]late-900"
                  }`
                }
              >
                <GraduationCap size={16} />
                <span>My Learning</span>
              </NavLink>
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-[13px]late-600 hover:bg-slate-100 hover:text-[13px]late-900 transition-all"
              >
                <span>Visit Main Site</span>
                <ExternalLink size={13} className="text-[13px]late-400" />
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-[13px] font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Batch Active • FS-JUL-26</span>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div
                  className="h-8 w-8 rounded-lg bg-slate-100 bg-cover bg-no-repeat ring-1 ring-slate-200 shrink-0"
                  style={{
                    backgroundImage: `url("${user?.profileImage ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      }")`,
                    backgroundPosition: "top center",
                    backgroundSize: "cover",
                  }}
                  role="img"
                  aria-label={user?.name || "Student"}
                />
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name || "Learner"}
                  </p>
                  <p className="text-xs font-semibold text-blue-600 leading-tight">
                    {user?.role || "Student"}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
                    <div className="border-b border-slate-100 pb-3 px-1">
                      <p className="text-xs font-bold text-[13px]late-900">
                        {user?.name || "Student"}
                      </p>
                      <p className="text-[13px] text-[13px]late-500 truncate">
                        {user?.email || "student@apnavidya.com"}
                      </p>
                      <div className="mt-2 flex items-center justify-between rounded-lg bg-blue-50/70 px-2.5 py-1 text-[12px] font-bold text-blue-700">
                        <span>Roll No: STU-2026-001</span>
                        <span className="text-emerald-700 font-extrabold">Verified</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1">
                      <Link
                        to="/"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink size={15} className="text-[13px]late-400" />
                        <span>Public Course Catalog</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-[13px]late-700 md:hidden hover:bg-slate-100 cursor-pointer"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden space-y-2 animate-in slide-in-from-top-2">
            <Link
              to="/student/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700"
            >
              <GraduationCap size={16} />
              <span>My Learning Dashboard</span>
            </Link>
            <Link
              to="/"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-100"
            >
              <ExternalLink size={16} className="text-[13px]late-400" />
              <span>Explore Public Website</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-[13px]late-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 APNAVIDYA Edutech. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-medium text-[13px]late-600">
            <a href="mailto:support@apnavidya.com" className="hover:text-blue-600 transition-colors">
              Student Helpdesk
            </a>
            <span className="text-[13px]late-300">•</span>
            <Link to="/verify-certificate" className="hover:text-blue-600 transition-colors">
              Verify Certificate
            </Link>
            <span className="text-[13px]late-300">•</span>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
