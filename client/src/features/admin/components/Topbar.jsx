import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ExternalLink,
  CheckCircle2,
  X,
} from "lucide-react";
import { adminProfileData } from "../../../data/admin/settingsData";
import { useAuth } from "../../../context/AuthContext";
import { useSettings } from "../../../context/SettingsContext";
import api from "../../../services/api";

const Topbar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const siteName = settings.general?.siteName || "ApnaVidya";
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_read_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      try {
        const res = await api.get("/admin/leads?limit=5");
        if (res.data?.data?.leads) {
          const storedRead = (() => {
            try {
              return JSON.parse(localStorage.getItem("admin_read_notifications") || "[]");
            } catch {
              return [];
            }
          })();

          setNotifications(
            res.data.data.leads.map((l) => ({
              id: l.id,
              title: (l.source || "").toLowerCase().includes("demo")
                ? "Demo Class Booking"
                : "New Lead Inquiry",
              description: `${l.name} (${l.course || "General Inquiry"})`,
              time: new Date(l.createdAt).toLocaleDateString(),
              unread: l.status === "New" && !storedRead.includes(l.id),
            }))
          );
        }
      } catch {
        setNotifications([]);
      }
    };
    fetchRecentAlerts();
  }, []);

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem("admin_read_notifications", JSON.stringify(updated));
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notif) => {
    const updated = Array.from(new Set([...readNotifIds, notif.id]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem("admin_read_notifications", JSON.stringify(updated));
    } catch {}
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    setNotificationsOpen(false);
    navigate(`/admin/leads/${notif.id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/leads")) return "Lead Management";
    if (path.includes("/students")) return "Students Management";
    if (path.includes("/courses")) return "Course Management";
    if (path.includes("/batches")) return "Batch Management";
    if (path.includes("/course-materials")) return "Course Learning Materials";
    if (path.includes("/syllabus")) return "Syllabus Management";
    if (path.includes("/payments")) return "Payments & Financials";
    if (path.includes("/demo-classes")) return "Demo Class Bookings";
    if (path.includes("/certificates")) return "Awards & Accreditations";
    if (path.includes("/blogs")) return "Blog Management";
    if (path.includes("/blog-categories")) return "Blog Categories";
    if (path.includes("/hero-sliders")) return "Hero Slider Banners";
    if (path.includes("/notifications")) return "Announcement Notifications";
    if (path.includes("/about-us")) return "About Us CMS";
    if (path.includes("/video-section")) return "Home Video Section CMS";
    if (path.includes("/contact-details")) return "Contact Details CMS";
    if (path.includes("/holiday-emails")) return "Holiday Email Campaigns";
    if (path.includes("/testimonials")) return "Student Testimonials";
    if (path.includes("/users")) return "Admin Users";
    if (path.includes("/roles")) return "Roles & Permissions";
    if (path.includes("/activity-logs")) return "Audit Activity Logs";
    if (path.includes("/settings")) return "System Settings";
    if (path.includes("/profile")) return "Admin Profile";
    return "Dashboard Overview";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    setSearchOpen(false);
    setSearchQuery("");
    if (q.includes("lead")) navigate("/admin/leads");
    else if (q.includes("student")) navigate("/admin/students");
    else if (q.includes("course")) navigate("/admin/courses");
    else if (q.includes("pay")) navigate("/admin/payments");
    else if (q.includes("cert") || q.includes("award")) navigate("/admin/certificates");
    else if (q.includes("demo")) navigate("/admin/demo-classes");
    else navigate("/admin/dashboard");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-all duration-200 cursor-pointer active:scale-90 shadow-2xs"
            aria-label="Toggle sidebar"
            title={sidebarOpen ? "Collapse sidebar (icons only)" : "Expand sidebar (full text)"}
          >
            <div
              className={`transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${sidebarOpen ? "rotate-90 text-slate-700" : "rotate-0 text-slate-600"
                }`}
            >
              {sidebarOpen ? (
                <X size={20} strokeWidth={2.2} color="red" />
              ) : (
                <Menu size={20} strokeWidth={2.2} color="blue" />
              )}
            </div>
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-blue-600 hidden sm:block">
              {siteName} Admin
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {getPageTitle()}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-300 hover:bg-white hover:text-slate-600 transition-all cursor-pointer"
          >
            <Search size={14} />
            <span className="hidden md:inline">Quick search module...</span>

          </button>

          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            title="View live public website"
          >
            <span>Live Site</span>
            <ExternalLink size={13} />
          </Link>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell size={17} />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FD8006] ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Recent Inquiries & Alerts
                  </h4>
                  <div className="flex items-center gap-2">
                    {notifications.some((n) => n.unread) && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      notifications.some((n) => n.unread)
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {notifications.filter((n) => n.unread).length} New
                    </span>
                  </div>
                </div>

                <div className="mt-2 divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer ${
                          notif.unread ? "bg-blue-50/50 hover:bg-blue-50/80" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {notif.unread && (
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                            )}
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {notif.title}
                            </p>
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-snug pl-3">
                          {notif.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 mt-2 border-t border-slate-100 text-center">
                  <Link
                    to="/admin/leads"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All Leads & Inquiries
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 p-1 sm:px-2.5 sm:py-1 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div
                className="h-7 w-7 rounded-lg bg-slate-100 bg-cover bg-no-repeat ring-1 ring-blue-100 shrink-0"
                style={{
                  backgroundImage: `url("${user?.profileImage || adminProfileData.avatar}")`,
                  backgroundPosition: "top center",
                  backgroundSize: "cover",
                }}
                role="img"
                aria-label={user?.name || adminProfileData.name}
              />
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || adminProfileData.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">
                  {user?.role || adminProfileData.role}
                </p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || adminProfileData.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email || adminProfileData.email}
                  </p>
                </div>

                <Link
                  to="/admin/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User size={15} className="text-slate-400" />
                  <span>Admin Profile</span>
                </Link>

                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Settings size={15} className="text-slate-400" />
                  <span>System Settings</span>
                </Link>

                <div className="border-t border-slate-100 my-1 pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      setProfileOpen(false);
                      await logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-900/50 backdrop-blur-xs"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads, students, courses, payments..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Jump to:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  navigate("/admin/leads");
                }}
                className="rounded-md bg-slate-100 px-2 py-1 hover:bg-blue-50 hover:text-blue-600"
              >
                Leads
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  navigate("/admin/students");
                }}
                className="rounded-md bg-slate-100 px-2 py-1 hover:bg-blue-50 hover:text-blue-600"
              >
                Students
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  navigate("/admin/courses");
                }}
                className="rounded-md bg-slate-100 px-2 py-1 hover:bg-blue-50 hover:text-blue-600"
              >
                Courses
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  navigate("/admin/payments");
                }}
                className="rounded-md bg-slate-100 px-2 py-1 hover:bg-blue-50 hover:text-blue-600"
              >
                Payments
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
