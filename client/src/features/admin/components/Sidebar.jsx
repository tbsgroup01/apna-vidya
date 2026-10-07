import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  BookOpen,
  PlayCircle,
  Award,
  Newspaper,
  Sliders,
  Building2,
  Video,
  Mail,
  Settings,
  UserCircle,
  LogOut,
  MessageSquareQuote,
  Megaphone,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useSettings, sanitizeAssetUrl } from "../../../context/SettingsContext";
import logo from "../../../assets/apnavidya.png";
import faviconLogo from "../../../assets/favicon.png";

const navSections = [
  {
    title: null,
    items: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Leads",
        path: "/admin/leads",
        icon: Target,
        badge: "New",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
      {
        label: "Students",
        path: "/admin/students",
        icon: GraduationCap,
        color: "text-emerald-500",
        bgColor: "bg-emerald-50",
      },
      {
        label: "Courses",
        path: "/admin/courses",
        icon: BookOpen,
        color: "text-indigo-500",
        bgColor: "bg-indigo-50",
      },
      {
        label: "Demo Classes",
        path: "/admin/demo-classes",
        icon: PlayCircle,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
      },
      {
        label: "Awards & Showcase",
        path: "/admin/certificates",
        icon: Award,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "Blogs",
        path: "/admin/blogs",
        icon: Newspaper,
        color: "text-rose-500",
        bgColor: "bg-rose-50",
      },
      {
        label: "Hero Sliders",
        path: "/admin/hero-sliders",
        icon: Sliders,
        color: "text-cyan-500",
        bgColor: "bg-cyan-50",
      },
      {
        label: "Video Section",
        path: "/admin/video-section",
        icon: Video,
        color: "text-red-500",
        bgColor: "bg-red-50",
      },
      {
        label: "About Us",
        path: "/admin/about-us",
        icon: Building2,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
      },
      {
        label: "Testimonials",
        path: "/admin/testimonials",
        icon: MessageSquareQuote,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        label: "Alert Notifications",
        path: "/admin/notifications",
        icon: Megaphone,
        color: "text-amber-500",
        bgColor: "bg-amber-50",
      },
      {
        label: "Holiday Emails",
        path: "/admin/holiday-emails",
        icon: Mail,
        color: "text-orange-500",
        bgColor: "bg-orange-50",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
        color: "text-slate-600",
        bgColor: "bg-slate-100",
      },
      {
        label: "Admin Profile",
        path: "/admin/profile",
        icon: UserCircle,
        color: "text-violet-600",
        bgColor: "bg-violet-50",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { settings } = useSettings();
  const logoSrc = sanitizeAssetUrl(settings.general?.logoUrl, logo);
  const faviconSrc = sanitizeAssetUrl(settings.general?.faviconUrl, faviconLogo) || faviconLogo;

  const handleSignOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop (< lg screens) */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity duration-300 print:hidden ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/90 bg-white shadow-xl lg:shadow-xs transition-[width,transform] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] print:hidden ${sidebarOpen
          ? "w-64 translate-x-0"
          : "w-64 -translate-x-full lg:translate-x-0 lg:w-20"
          }`}
      >
        {/* Header / Brand Logo */}
        <div
          className={`relative flex h-20 shrink-0 items-center border-b border-slate-100 transition-all duration-300 ${sidebarOpen ? "justify-between px-4" : "justify-center px-2"
            }`}
        >
          <Link
            to="/admin/dashboard"
            className="flex items-center justify-center overflow-hidden flex-1 group"
            title={sidebarOpen ? "ApnaVidya Admin Dashboard" : "ApnaVidya"}
          >
            {sidebarOpen ? (
              <img
                src={logoSrc}
                alt="ApnaVidya Logo"
                className="h-12 max-h-14 w-auto max-w-[180px] object-contain transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = logo;
                }}
              />
            ) : (
              <div className="relative flex items-center justify-center h-12 w-12 rounded-xl hover:bg-orange-50/70 transition-all duration-200 p-1">
                <img
                  src={faviconSrc}
                  alt="ApnaVidya Favicon"
                  className="h-10 w-10 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = faviconLogo;
                  }}
                />
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <div
          className={`flex-1 overflow-y-auto ${sidebarOpen ? "px-3 py-4 space-y-6" : "px-2 py-4 space-y-4"
            }`}
        >
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {/* Section Header */}
              {section.title && (
                sidebarOpen ? (
                  <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </p>
                ) : (
                  <div className="my-2.5 border-t border-slate-100 mx-2" />
                )
              )}

              {/* Items */}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={!sidebarOpen ? item.label : undefined}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={({ isActive }) =>
                      `group relative flex items-center ${sidebarOpen ? "gap-3 px-3 py-2" : "justify-center p-2"
                      } rounded-xl text-xs font-semibold transition-all duration-150 ${isActive
                        ? "bg-[#FD8006] text-white shadow-sm shadow-orange-500/25"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Colorful Icon Capsule */}
                        <div
                          className={`relative flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-all duration-150 ${isActive
                            ? "bg-white/20 text-white"
                            : `${item.bgColor} ${item.color} group-hover:scale-105 shadow-2xs`
                            }`}
                        >
                          <Icon size={18} className="shrink-0" />
                          {/* Indicator badge for collapsed view */}
                          {!sidebarOpen && item.badge && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#FD8006] ring-2 ring-white" />
                          )}
                        </div>

                        {/* Label text in expanded view */}
                        {sidebarOpen && (
                          <>
                            <span className="truncate flex-1 whitespace-nowrap animate-in fade-in duration-150">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-blue-50 text-blue-600"
                                  }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {/* Floating tooltip on hover when collapsed on desktop */}
                        {!sidebarOpen && (
                          <div className="pointer-events-none absolute left-full ml-3 z-50 hidden lg:group-hover:flex items-center px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="ml-1.5 rounded-full bg-[#FD8006] px-1.5 py-0.2 text-[10px] font-bold text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer / Sign Out */}
        <div className={`shrink-0 border-t border-slate-100 ${sidebarOpen ? "p-3" : "p-2"}`}>
          <button
            type="button"
            onClick={handleSignOut}
            title={!sidebarOpen ? "Sign Out" : undefined}
            className={`w-full flex items-center ${sidebarOpen ? "gap-3 px-3 py-2" : "justify-center p-2"
              } rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer group relative`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 shrink-0 group-hover:scale-105 transition-all shadow-2xs">
              <LogOut size={18} className="shrink-0" />
            </div>
            {sidebarOpen && <span className="animate-in fade-in duration-150">Sign Out</span>}
            {!sidebarOpen && (
              <div className="pointer-events-none absolute left-full ml-3 z-50 hidden lg:group-hover:flex items-center px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
