import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Menu,
    X,
    GraduationCap,
    BookOpen,
    FileText,
    PlayCircle,
    Newspaper,
    Phone,
    Home,
    User,
    LayoutDashboard,
    LogOut,
    ChevronDown,
    ShieldCheck,
    Users,
} from "lucide-react";

import { useDemoModal } from "../../../context/DemoModalContext";
import { useAuth } from "../../../context/AuthContext";
import { useSettings, sanitizeAssetUrl } from "../../../context/SettingsContext";
import logo from "../../../assets/apnavidya.png";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileDropdownRef = useRef(null);

    const { openDemoModal } = useDemoModal();
    const { isAuthenticated, user, logout } = useAuth();
    const { settings } = useSettings();

    const logoSrc = sanitizeAssetUrl(settings.general?.logoUrl, logo);
    const siteName = settings.general?.siteName || "Apna Vidya";

    const dashboardPath = user?.role === "Student" ? "/student/dashboard" : "/admin/dashboard";

    const location = useLocation();

    const navLinks = [
        {
            name: "Home",
            path: "/",
            icon: Home,
            exact: true,
        },
        {
            name: "About Us",
            path: "/about",
            icon: BookOpen,
        },
        {
            name: "Courses",
            path: "/courses",
            icon: GraduationCap,
        },
        {
            name: "Blog",
            path: "/blog",
            icon: Newspaper,
        },
        {
            name: "Contact Us",
            path: "/contact",
            icon: Phone,
        },
    ];

    const isLinkActive = (path, exact = false) => {
        const currentPath = location.pathname;
        if (exact || path === "/") {
            return currentPath === "/" || currentPath === "";
        }
        return currentPath === path || currentPath.startsWith(`${path}/`);
    };

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="group flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
                        aria-label={`${siteName} Home`}
                    >
                        <img
                            src={logoSrc}
                            alt={`${siteName} Logo`}
                            onError={(e) => {
                                if (e.currentTarget.src !== logo) {
                                    e.currentTarget.src = logo;
                                }
                            }}
                            className="h-13 sm:h-14 md:h-16 w-auto max-h-16 max-w-[210px] sm:max-w-[250px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                    </Link>

                    <nav className="hidden items-center gap-1.5 lg:flex">
                        {navLinks.map((link) => {
                            const active = isLinkActive(link.path, link.exact);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
                                        active
                                            ? "text-blue-600 bg-blue-50/90 font-bold shadow-2xs"
                                            : "text-slate-600 hover:text-blue-600 hover:bg-slate-50/80"
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    {active && (
                                        <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 rounded-full bg-blue-600 shadow-xs" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated && user && (
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50/80 p-1.5 pr-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group focus:outline-none"
                                    aria-expanded={isProfileOpen}
                                    aria-label="User Profile Menu"
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={
                                                user.profileImage ||
                                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                            }
                                            alt={user.name || "User"}
                                            className="h-9 w-9 rounded-xl object-cover object-top ring-2 ring-blue-500/20 shadow-2xs group-hover:ring-blue-500/40 transition-all"
                                            style={{ objectPosition: "top center" }}
                                        />
                                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                    </div>
                                    <div className="text-left hidden xl:block">
                                        <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate max-w-[120px]">
                                            {user.name || "Admin"}
                                        </p>
                                        <p className="text-[10px] font-semibold text-blue-600 leading-tight">
                                            {user.role || "Administrator"}
                                        </p>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isProfileOpen ? "rotate-180 text-blue-600" : ""
                                            }`}
                                    />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2.5 w-64 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                                        {/* Header Profile Info */}
                                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/90 border border-slate-100 mb-2">
                                            <img
                                                src={
                                                    user.profileImage ||
                                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                                }
                                                alt={user.name || "User"}
                                                className="h-10 w-10 rounded-xl object-cover object-top ring-2 ring-blue-500/20 shrink-0"
                                                style={{ objectPosition: "top center" }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-slate-900 truncate">
                                                    {user.name || "Admin"}
                                                </p>
                                                <p className="text-[11px] text-slate-500 truncate">
                                                    {user.email || "admin@apnavidya.com"}
                                                </p>
                                                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/60 px-2 py-0.2 text-[10px] font-bold text-blue-700">
                                                    <ShieldCheck size={10} />
                                                    <span>{user.role || "Administrator"}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Quick Navigation Links */}
                                        <div className="space-y-1">
                                            <Link
                                                to={dashboardPath}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                            >
                                                <LayoutDashboard size={15} className="text-blue-600" />
                                                <span>{user.role === "Student" ? "My Learning Dashboard" : "Admin Dashboard"}</span>
                                            </Link>

                                            <Link
                                                to={user.role === "Student" ? "/student/profile" : "/admin/profile"}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                                            >
                                                <User size={15} className="text-slate-400" />
                                                <span>Profile Settings</span>
                                            </Link>

                                            {user.role !== "Student" && (
                                                <>
                                                    <Link
                                                        to="/admin/students"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                                                    >
                                                        <Users size={15} className="text-slate-400" />
                                                        <span>Student Directory</span>
                                                    </Link>

                                                    <Link
                                                        to="/admin/demo-classes"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                                                    >
                                                        <PlayCircle size={15} className="text-slate-400" />
                                                        <span>Demo Class Requests</span>
                                                    </Link>
                                                </>
                                            )}
                                        </div>

                                        <div className="pt-2 mt-2 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    logout();
                                                }}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            >
                                                <LogOut size={15} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => openDemoModal()}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 cursor-pointer"
                        >
                            <PlayCircle size={17} />
                            Demo
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="border-t border-gray-100 py-4 lg:hidden">
                        <nav className="space-y-1">
                            {isAuthenticated && user && (
                                <div className="mb-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={
                                                user.profileImage ||
                                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                            }
                                            alt={user.name || "User"}
                                            className="h-11 w-11 rounded-xl object-cover object-top ring-2 ring-blue-500/20"
                                            style={{ objectPosition: "top center" }}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {user.name || "User"}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {user.email || "admin@apnavidya.com"}
                                            </p>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 mt-1">
                                                {user.role || "Administrator"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            to={dashboardPath}
                                            onClick={closeMobileMenu}
                                            className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-2xs"
                                        >
                                            <LayoutDashboard size={14} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeMobileMenu();
                                                logout();
                                            }}
                                            className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 cursor-pointer"
                                        >
                                            <LogOut size={14} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isLinkActive(link.path, link.exact);

                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                                            active
                                                ? "bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600 pl-3.5 shadow-2xs"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                    >
                                        <Icon
                                            size={18}
                                            className={active ? "text-blue-600" : "text-slate-400"}
                                        />
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}

                            <div className="pt-3 border-t border-gray-100 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeMobileMenu();
                                        openDemoModal();
                                    }}
                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                                >
                                    <PlayCircle size={17} />
                                    Demo
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;