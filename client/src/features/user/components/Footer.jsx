import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    ArrowRight,
} from "lucide-react";
import { useSettings } from "../../../context/SettingsContext";
import api from "../../../services/api";
import { coursesData } from "../../../data/coursesData";
import logo from "../../../assets/apnavidya.png";

const FacebookIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TwitterIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
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

    const logoSrc = settings.general?.logoUrl || logo;
    const siteName = settings.general?.siteName || "Apna Vidya";
    const tagline = settings.general?.tagline || "Learn • Grow • Succeed";
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
        { name: "Syllabus", path: "/syllabus" },
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

    return (
        <footer className="bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <Link
                            to="/"
                            className="mb-6 inline-flex items-center gap-3 group focus:outline-none"
                            aria-label={`${siteName} Home`}
                        >
                            <div className="inline-flex items-center rounded-2xl bg-white/95 px-3.5 py-2 shadow-xs transition-all duration-200 group-hover:bg-white group-hover:shadow-md group-hover:scale-[1.02]">
                                <img
                                    src={logoSrc}
                                    alt={`${siteName} Logo`}
                                    onError={(e) => {
                                        if (e.currentTarget.src !== logo) {
                                            e.currentTarget.src = logo;
                                        }
                                    }}
                                    className="h-11 sm:h-12 w-auto max-h-14 max-w-[210px] object-contain"
                                />
                            </div>
                        </Link>

                        <p className="max-w-sm text-sm leading-7 text-slate-400">
                            Empowering students with quality education, practical
                            skills, and industry-focused learning programs to build
                            a successful career.
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            {social.facebook && (
                                <a
                                    href={social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-all hover:bg-blue-600 hover:text-white"
                                >
                                    <FacebookIcon size={18} />
                                </a>
                            )}

                            {social.instagram && (
                                <a
                                    href={social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-all hover:bg-pink-600 hover:text-white"
                                >
                                    <InstagramIcon size={18} />
                                </a>
                            )}

                            {social.linkedin && (
                                <a
                                    href={social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-all hover:bg-blue-700 hover:text-white"
                                >
                                    <LinkedinIcon size={18} />
                                </a>
                            )}

                            {social.youtube && (
                                <a
                                    href={social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-all hover:bg-red-600 hover:text-white"
                                >
                                    <YoutubeIcon size={18} />
                                </a>
                            )}

                            {social.twitter && (
                                <a
                                    href={social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-slate-400 transition-all hover:bg-sky-500 hover:text-white"
                                >
                                    <TwitterIcon size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-blue-400"
                                    >
                                        <ArrowRight
                                            size={14}
                                            className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                                        />
                                        <span className="transition-transform group-hover:translate-x-1">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                            Popular Courses
                        </h3>

                        <ul className="space-y-3">
                            {courseLinks.map((course) => (
                                <li key={course.name}>
                                    <Link
                                        to={course.path}
                                        className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-blue-400"
                                    >
                                        <ArrowRight
                                            size={14}
                                            className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                                        />
                                        <span className="transition-transform group-hover:translate-x-1">
                                            {course.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1.5">
                                <Link
                                    to="/courses"
                                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <span>Browse All Courses</span>
                                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                            Get In Touch
                        </h3>

                        <div className="space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Address
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        {address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Phone
                                    </p>
                                    <a
                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                        className="mt-1 block text-sm text-slate-400 transition-colors hover:text-blue-400"
                                    >
                                        {phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Email
                                    </p>
                                    <a
                                        href={`mailto:${email}`}
                                        className="mt-1 block text-sm text-slate-400 transition-colors hover:text-blue-400"
                                    >
                                        {email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Working Hours
                                    </p>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {workingHours}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <p className="text-center text-sm text-slate-500 md:text-left">
                        © {currentYear} {siteName}. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
                        <Link
                            to="/privacy-policy"
                            className="transition-colors hover:text-blue-400"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms"
                            className="transition-colors hover:text-blue-400"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            to="/refund-policy"
                            className="transition-colors hover:text-blue-400"
                        >
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;