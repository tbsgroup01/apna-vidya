import React, { useState } from "react";
import { Link } from "react-router-dom";

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

} from "lucide-react";


import { useDemoModal } from "../../../context/DemoModalContext";
import { useAuth } from "../../../context/AuthContext";
import { useSettings } from "../../../context/SettingsContext";
import logo from "../../../assets/apnavidya.png";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openDemoModal } = useDemoModal();
    const { isAuthenticated, user } = useAuth();
    const { settings } = useSettings();

    const logoSrc = settings.general?.logoUrl || logo;
    const siteName = settings.general?.siteName || "Apna Vidya";

    const dashboardPath = user?.role === "Student" ? "/student/dashboard" : "/admin/dashboard";
    const dashboardLabel = user?.role === "Student" ? "My Learning" : "Dashboard";

    const navLinks = [
        {
            name: "Syllabus",
            path: "/syllabus",
            icon: FileText,
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

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

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

                    <nav className="hidden items-center gap-1 lg:flex">
                        <Link
                            to="/"
                            className="rounded-lg px-4 py-2.5 text-[13px]m font-medium text-blue-600 transition-colors hover:bg-blue-50"
                        >
                            Home
                        </Link>

                        <Link
                            to="/about"
                            className="rounded-lg px-4 py-2.5 text-[13px]m font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            About Us
                        </Link>

                        <Link
                            to="/courses"
                            className="rounded-lg px-4 py-2.5 text-[13px]m font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            Courses
                        </Link>

                        {navLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="rounded-lg px-4 py-2.5 text-[13px]m font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>



                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated && user && (
                            <Link
                                to={dashboardPath}
                                className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200/80 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all shadow-2xs"
                            >
                                <img
                                    src={
                                        user.profileImage ||
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                                    }
                                    alt={user.name || "User"}
                                    className="h-5 w-5 rounded-full object-cover ring-1 ring-blue-300"
                                />
                                <span>{dashboardLabel}</span>
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={() => openDemoModal()}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[13px]m font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 cursor-pointer"
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
                            <Link
                                to="/"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-[13px]m font-semibold text-blue-600"
                            >
                                <Home size={18} />
                                Home
                            </Link>

                            <Link
                                to="/about"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px]m font-medium text-gray-600 hover:bg-gray-50"
                            >
                                <BookOpen size={18} />
                                About Us
                            </Link>

                            <Link
                                to="/courses"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px]m font-medium text-gray-600 hover:bg-gray-50"
                            >
                                <GraduationCap size={18} />
                                Courses
                            </Link>

                            {navLinks.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px]m font-medium text-gray-600 hover:bg-gray-50"
                                    >
                                        <Icon size={18} />
                                        {link.name}
                                    </Link>
                                );
                            })}

                            <div className="pt-3 border-t border-gray-100 mt-2">
                                {isAuthenticated && user && (
                                    <Link
                                        to={dashboardPath}
                                        onClick={closeMobileMenu}
                                        className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-[13px]m font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                                    >
                                        <GraduationCap size={17} />
                                        <span>{dashboardLabel}</span>
                                    </Link>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        closeMobileMenu();
                                        openDemoModal();
                                    }}
                                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-[13px]m font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
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