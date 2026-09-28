import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  BookOpen,
  Layers,
  FileBox,
  FileText,
  PlayCircle,
  CreditCard,
  Award,
  Newspaper,
  Sliders,
  Bell,
  Building2,
  Mail,
  Settings,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useSettings } from "../../../context/SettingsContext";
import logo from "../../../assets/apnavidya.png";

const navSections = [
  {
    title: null,
    items: [
      { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Leads", path: "/admin/leads", icon: Target, badge: "New" },
      { label: "Students", path: "/admin/students", icon: GraduationCap },
      { label: "Courses", path: "/admin/courses", icon: BookOpen },
      { label: "Curriculum", path: "/admin/syllabus", icon: Layers },
      { label: "Demo Classes", path: "/admin/demo-classes", icon: PlayCircle },
      { label: "Awards & Showcase", path: "/admin/certificates", icon: Award },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blogs", path: "/admin/blogs", icon: Newspaper },
      { label: "Hero Sliders", path: "/admin/hero-sliders", icon: Sliders },
      { label: "Notifications", path: "/admin/notifications", icon: Bell },
      { label: "About Us", path: "/admin/about-us", icon: Building2 },
    ],
  },
  {
    title: "Communication",
    items: [
      { label: "Holiday Emails", path: "/admin/holiday-emails", icon: Mail },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings", path: "/admin/settings", icon: Settings },
      { label: "Admin Profile", path: "/admin/profile", icon: UserCircle },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { settings } = useSettings();
  const logoSrc = settings.general?.logoUrl || logo;

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity duration-300 print:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/90 bg-white shadow-xl lg:shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] print:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center justify-start overflow-hidden flex-1"
          >
            <img
              src={logoSrc}
              alt="Logo"
              className="h-14 max-h-16 w-auto max-w-[190px] object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = logo;
              }}
            />
          </Link>


        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <p className="px-3 text-[12px] font-bold uppercase tracking-wider text-[13px]late-400">
                  {section.title}
                </p>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                        : "text-[13px]late-600 hover:bg-slate-100 hover:text-[13px]late-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          className={`shrink-0 transition-transform group-hover:scale-110 ${isActive
                            ? "text-white"
                            : "text-[13px]late-500 group-hover:text-blue-600"
                            }`}
                        />
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[12px] font-bold ${isActive
                              ? "bg-white/20 text-white"
                              : "bg-blue-50 text-blue-600"
                              }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
