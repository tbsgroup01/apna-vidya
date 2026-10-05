import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Menu,
    X,
    BookOpen,
    FileText,
    PlayCircle,
    Home,
    User,
    LayoutDashboard,
    LogOut,
    ChevronDown,
    ShieldCheck,
    Users,
    Mail,
    ArrowRight,
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
    const siteName = settings.general?.siteName || "ApnaVidya";

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
            icon: Users,
        },
        {
            name: "Courses",
            path: "/courses",
            icon: BookOpen,
        },
        {
            name: "Blog",
            path: "/blog",
            icon: FileText,
        },
        {
            name: "Contact Us",
            path: "/contact",
            icon: Mail,
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
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.05)] border-b border-slate-100">
            {/* Top Multi-color Gradient Accent Line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-[#FD8006]" />

            {/* Background Corner Wave Accents */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                {/* Left Corner Soft Blue Wave */}
                <svg
                    className="absolute -top-1 -left-2 h-20 w-32 sm:w-44 text-sky-200/50"
                    viewBox="0 0 160 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 0 C50 15 80 50 160 75 L0 80 Z"
                        fill="url(#navLeftGrad)"
                    />
                    <defs>
                        <linearGradient id="navLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Right Corner Soft Peach Wave */}
                <svg
                    className="absolute -bottom-2 -right-2 h-20 w-32 sm:w-44 text-orange-200/50"
                    viewBox="0 0 160 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M160 0 C110 20 80 50 0 75 L160 80 Z"
                        fill="url(#navRightGrad)"
                    />
                    <defs>
                        <linearGradient id="navRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.75" />
                            <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.15" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-18 sm:h-20 items-center justify-between">
                    {/* Left: Brand Logo */}
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
                            className="h-11 sm:h-13 md:h-14 w-auto max-h-14 max-w-[210px] sm:max-w-[240px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                    </Link>

                    {/* Center: Desktop Navigation Links with Icons */}
                    <nav className="hidden items-center gap-1.5 lg:flex">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isLinkActive(link.path, link.exact);
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-150 ${active
                                        ? "text-blue-600 bg-blue-50/90 font-bold shadow-2xs"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50/80"
                                        }`}
                                >
                                    <Icon
                                        size={16}
                                        strokeWidth={active ? 2.3 : 1.9}
                                        className={active ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600"}
                                    />
                                    <span>{link.name}</span>
                                    {active && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-[#FD8006] shadow-xs" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: Actions (Demo Button + Profile Pill) */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Demo Button */}
                        <button
                            type="button"
                            onClick={() => openDemoModal()}
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FD8006] to-[#f97316] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(253,128,6,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(253,128,6,0.45)] hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                            <PlayCircle size={18} className="fill-white/20 text-white shrink-0" />
                            <span>Demo</span>
                            <ArrowRight size={15} strokeWidth={2.5} className="shrink-0" />
                        </button>

                        {/* Profile Dropdown Capsule */}
                        {isAuthenticated && user ? (
                            <div className="relative" ref={profileDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 p-1 pl-1 pr-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group focus:outline-none"
                                    aria-expanded={isProfileOpen}
                                    aria-label="User Profile Menu"
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                user.profileImage ||
                                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                            }
                                            alt={user.name || "User"}
                                            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover object-top transition-all"
                                            style={{ objectPosition: "top center" }}
                                        />
                                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
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
                                                className="h-10 w-10 rounded-full object-cover object-top ring-2 ring-blue-500/20 shrink-0"
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
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:border-blue-500 hover:text-blue-600 transition-all"
                            >
                                <User size={14} className="text-slate-500" />
                                <span>Sign In</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Floating overlay - does NOT push page content down) */}
            {isMenuOpen && (
                <>
                    {/* Backdrop Overlay to close on tap outside */}
                    <div
                        className="fixed inset-0 top-[72px] sm:top-[80px] bg-slate-900/35 backdrop-blur-2xs z-40 lg:hidden animate-in fade-in duration-150"
                        onClick={closeMobileMenu}
                        aria-hidden="true"
                    />

                    {/* Floating Mobile Dropdown Menu */}
                    <div className="absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-xl border-t border-b border-slate-200 shadow-2xl py-4 px-4 sm:px-6 lg:hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100vh-5rem)] overflow-y-auto z-50">
                        <div className="mx-auto max-w-7xl">
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
                                                className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-blue-500/20"
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
                                                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#FD8006] px-3 py-2 text-xs font-bold text-white shadow-2xs"
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
                                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${active
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

                                <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            closeMobileMenu();
                                            openDemoModal();
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FD8006] to-[#f97316] px-4 py-3 text-sm font-semibold text-white hover:opacity-95 transition-all shadow-sm cursor-pointer"
                                    >
                                        <PlayCircle size={18} className="fill-white/20 text-white shrink-0" />
                                        <span>Demo</span>
                                        <ArrowRight size={15} strokeWidth={2.5} className="shrink-0" />
                                    </button>

                                    {!isAuthenticated && (
                                        <Link
                                            to="/login"
                                            onClick={closeMobileMenu}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                                        >
                                            <User size={16} className="text-slate-500" />
                                            <span>Sign In</span>
                                        </Link>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;