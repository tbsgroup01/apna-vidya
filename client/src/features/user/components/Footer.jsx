import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    ArrowRight,
    ArrowUp,
    ChevronRight,
} from "lucide-react";
import { useSettings, sanitizeAssetUrl } from "../../../context/SettingsContext";
import api from "../../../services/api";
import { coursesData } from "../../../data/coursesData";
import logo from "../../../assets/apnavidya.png";

const FacebookIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#igGradFooter)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
            <linearGradient id="igGradFooter" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f09433" />
                <stop offset="25%" stopColor="#e6683c" />
                <stop offset="50%" stopColor="#dc2743" />
                <stop offset="75%" stopColor="#cc2366" />
                <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
        </defs>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TwitterIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const defaultCourseLinks = coursesData.slice(0, 5).map((c) => ({
    name: c.title || c.name,
    path: `/courses/${c.slug}`,
}));

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { settings } = useSettings();
    const [courseLinks, setCourseLinks] = useState(defaultCourseLinks);

    const logoSrc = sanitizeAssetUrl(settings.general?.logoUrl, logo);
    const siteName = settings.general?.siteName || "ApnaVidya";
    const contact = settings.contact || {};
    const social = contact.social || {};

    const address = contact.address || "Apna Vidya Tower, 4th Floor, Sector 62, Noida, UP - 201301";
    const phone = contact.phone || "+91 98765 43210";
    const email = contact.email || "admissions@apnavidya.com";
    const workingHours = contact.workingHours || "Mon - Sat: 9:00 AM - 7:00 PM";

    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Courses", path: "/courses" },
        { name: "Blog", path: "/blog" },
        { name: "Contact Us", path: "/contact" },
    ];

    useEffect(() => {
        let isMounted = true;
        const fetchRealCourses = async () => {
            try {
                const res = await api.get("/public/courses?limit=5&status=Active");
                const live = res.data?.data?.courses;
                if (isMounted && Array.isArray(live) && live.length > 0) {
                    setCourseLinks(
                        live.map((c) => ({
                            name: c.name || c.title,
                            path: `/courses/${c.slug || c.id}`,
                        }))
                    );
                }
            } catch {
            }
        };
        fetchRealCourses();
        return () => {
            isMounted = false;
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative w-full overflow-hidden border-t border-slate-100 bg-white text-slate-800">
            {/* Soft blue corner waves matching reference design */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                {/* Bottom Left Corner Wave */}
                <svg
                    className="absolute -bottom-1 -left-4 w-[340px] sm:w-[460px] md:w-[580px] h-[170px] sm:h-[210px] md:h-[250px] opacity-75"
                    viewBox="0 0 600 260"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,140 C130,120 210,210 350,185 C450,165 520,205 600,195 L600,260 L0,260 Z"
                        fill="url(#leftWaveGradA)"
                    />
                    <path
                        d="M0,90 C150,85 240,175 390,145 C490,125 540,155 600,145 L600,260 L0,260 Z"
                        fill="url(#leftWaveGradB)"
                    />
                    <defs>
                        <linearGradient id="leftWaveGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.12" />
                        </linearGradient>
                        <linearGradient id="leftWaveGradB" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.38" />
                            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.08" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Bottom Right Corner Wave */}
                <svg
                    className="absolute -bottom-1 -right-4 w-[340px] sm:w-[460px] md:w-[580px] h-[170px] sm:h-[210px] md:h-[250px] opacity-75"
                    viewBox="0 0 600 260"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M600,140 C470,120 390,210 250,185 C150,165 80,205 0,195 L0,260 L600,260 Z"
                        fill="url(#rightWaveGradA)"
                    />
                    <path
                        d="M600,90 C450,85 360,175 210,145 C110,125 60,155 0,145 L0,260 L600,260 Z"
                        fill="url(#rightWaveGradB)"
                    />
                    <defs>
                        <linearGradient id="rightWaveGradA" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.12" />
                        </linearGradient>
                        <linearGradient id="rightWaveGradB" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.38" />
                            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.08" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Main Footer Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Column 1: Logo & Brand Info */}
                    <div className="flex flex-col">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl w-fit"
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
                                className="h-16 sm:h-18 w-auto max-h-20 max-w-[210px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500 font-normal">
                            Empowering students with quality education, practical
                            skills, and industry-focused learning programs to build
                            a successful career.
                        </p>

                        {/* Social Buttons */}
                        <div className="mt-6 flex items-center gap-2.5">
                            <a
                                href={social.facebook || "https://facebook.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1877F2] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 transition-all hover:scale-105 hover:shadow-md active:scale-95"
                            >
                                <FacebookIcon size={18} />
                            </a>

                            <a
                                href={social.instagram || "https://instagram.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 transition-all hover:scale-105 hover:shadow-md active:scale-95"
                            >
                                <InstagramIcon size={18} />
                            </a>

                            <a
                                href={social.linkedin || "https://linkedin.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0A66C2] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 transition-all hover:scale-105 hover:shadow-md active:scale-95"
                            >
                                <LinkedinIcon size={18} />
                            </a>

                            <a
                                href={social.youtube || "https://youtube.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#FF0000] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 transition-all hover:scale-105 hover:shadow-md active:scale-95"
                            >
                                <YoutubeIcon size={18} />
                            </a>

                            <a
                                href={social.twitter || "https://twitter.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X / Twitter"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 transition-all hover:scale-105 hover:shadow-md active:scale-95"
                            >
                                <TwitterIcon size={15} />
                            </a>
                        </div>

                        {/* Follow Us handwritten callout */}
                        <div className="mt-3 flex items-center gap-1.5 pl-1.5 select-none">
                            <span className="font-handwriting text-xl font-bold tracking-wide text-slate-500 italic">
                                Follow Us
                            </span>
                            <svg
                                className="w-8 h-5 text-slate-400 stroke-current -rotate-6 transition-transform hover:translate-x-0.5"
                                viewBox="0 0 36 22"
                                fill="none"
                            >
                                <path
                                    d="M3 18 C12 18, 22 13, 29 4"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M22 4 H29 V11"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                            QUICK LINKS
                        </h3>
                        <div className="mt-2 mb-6 h-1 w-7 rounded-full bg-blue-600" />

                        <ul className="space-y-3.5">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                                    >
                                        <ChevronRight
                                            size={15}
                                            strokeWidth={3}
                                            className="text-blue-600 transition-transform group-hover:translate-x-0.5 shrink-0"
                                        />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Popular Courses */}
                    <div>
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                            POPULAR COURSES
                        </h3>
                        <div className="mt-2 mb-6 h-1 w-7 rounded-full bg-[#FD8006]" />

                        <ul className="space-y-3.5">
                            {courseLinks.slice(0, 5).map((course, idx) => (
                                <li key={course.path || idx}>
                                    <Link
                                        to={course.path}
                                        className="group flex items-center gap-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                                    >
                                        <ChevronRight
                                            size={15}
                                            strokeWidth={3}
                                            className="text-blue-600 transition-transform group-hover:translate-x-0.5 shrink-0"
                                        />
                                        <span className="truncate">{course.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-5">
                            <Link
                                to="/courses"
                                className="inline-flex items-center gap-2 rounded-full bg-blue-50/90 px-6 py-2.5 text-xs sm:text-sm font-semibold text-blue-600 shadow-[0_2px_10px_rgba(37,99,235,0.08)] border border-blue-100/70 transition-all hover:bg-blue-100/80 hover:shadow-[0_4px_14px_rgba(37,99,235,0.15)] hover:-translate-y-0.5"
                            >
                                <span>Browse All Courses</span>
                                <ArrowRight size={15} strokeWidth={2.2} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 4: Get In Touch */}
                    <div>
                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                            GET IN TOUCH
                        </h3>
                        <div className="mt-2 mb-6 h-1 w-7 rounded-full bg-blue-600" />

                        <div className="space-y-4">
                            {/* Address */}
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100/70 text-blue-600 shadow-2xs">
                                    <MapPin size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        ADDRESS
                                    </p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-700 font-medium">
                                        {address}
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100/70 text-orange-500 shadow-2xs">
                                    <Phone size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        PHONE
                                    </p>
                                    <a
                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                        className="mt-0.5 block text-sm font-bold text-slate-800 transition-colors hover:text-blue-600"
                                    >
                                        {phone}
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-600 shadow-2xs">
                                    <Mail size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        EMAIL
                                    </p>
                                    <a
                                        href={`mailto:${email}`}
                                        className="mt-0.5 block text-sm font-bold text-slate-800 transition-colors hover:text-blue-600 truncate"
                                    >
                                        {email}
                                    </a>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100/70 text-purple-600 shadow-2xs">
                                    <Clock size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        WORKING HOURS
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-700 font-medium">
                                        {workingHours}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright & Legal Links Bar */}
            <div className="relative z-10 border-t border-slate-100/80 bg-white/40 backdrop-blur-xs">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <p className="text-center text-xs font-medium text-slate-500 md:text-left">
                        © {currentYear} {siteName.toUpperCase()}. All rights reserved.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-500">
                            <Link
                                to="/privacy-policy"
                                className="transition-colors hover:text-blue-600"
                            >
                                Privacy Policy
                            </Link>
                            <span className="text-slate-300">|</span>
                            <Link
                                to="/terms"
                                className="transition-colors hover:text-blue-600"
                            >
                                Terms & Conditions
                            </Link>
                            <span className="text-slate-300">|</span>
                            <Link
                                to="/refund-policy"
                                className="transition-colors hover:text-blue-600"
                            >
                                Refund Policy
                            </Link>
                        </div>

                        {/* Scroll to Top Button */}
                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            className="ml-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-xs border border-blue-100/80 transition-all hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                        >
                            <ArrowUp size={15} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;