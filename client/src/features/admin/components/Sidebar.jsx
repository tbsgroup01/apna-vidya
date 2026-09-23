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

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20">
              AV
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  Apna Vidya
                </span>
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && !collapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </p>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      } ${collapsed ? "justify-center" : ""}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          className={`shrink-0 transition-transform group-hover:scale-110 ${isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-blue-600"
                            }`}
                        />
                        {!collapsed && (
                          <span className="truncate flex-1">{item.label}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive
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
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${collapsed ? "justify-center" : ""
              }`}
            title="Sign Out"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
