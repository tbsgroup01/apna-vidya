import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Check,
} from "lucide-react";
import api from "../../../services/api";

const initialCourses = [
    {
        id: 1,
        title: "Full Stack Development",
        description: "Build modern web applications with frontend and backend technologies.",
        image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
        features: [
            "React & Modern Frontend",
            "Node.js & Express",
            "Real-world Projects",
        ],
        path: "/courses/full-stack-development",
    },
    {
        id: 2,
        title: "Data Science & Artificial Intelligence",
        description: "Master Python, Machine Learning models, and predictive data pipelines.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        features: [
            "Python & Data Analysis",
            "Machine Learning Models",
            "Deep Learning & AI",
        ],
        path: "/courses/data-science-ai",
    },
    {
        id: 3,
        title: "Web Development",
        description: "Master HTML, CSS, JavaScript, Tailwind, and React.js modern ecosystems.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        features: [
            "Modern JavaScript & React",
            "Tailwind CSS Layouts",
            "Portfolio Ready Apps",
        ],
        path: "/courses/web-development",
    },
    {
        id: 4,
        title: "App Development",
        description: "Create cross-platform iOS and Android mobile apps from one codebase.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
        features: [
            "Flutter & React Native",
            "Mobile UI & State",
            "Play Store Publishing",
        ],
        path: "/courses/app-development",
    },
];

const PopularCourses = () => {
    const [courses, setCourses] = useState(initialCourses);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await api.get("/public/courses?limit=4&status=Active");
                const live = res.data?.data?.courses;
                if (live && live.length > 0) {
                    const mapped = live.map((c) => ({
                        id: c.id,
                        title: c.name,
                        description: c.description,
                        image: c.image || initialCourses[0].image,
                        features: [
                            c.duration || "6 Months",
                            c.level || "Beginner to Advanced",
                            "Live Interactive Classes",
                        ],
                        path: `/courses/${c.slug}`,
                    }));
                    setCourses(mapped);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPopular();
    }, []);

    return (
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
            {/* Background Decor: Side Dot Grids and Corner Waves */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                {/* Top Left Peach / Orange Flowing Gradient Curve */}
                <div className="absolute -top-12 -left-12 h-80 w-80 rounded-full bg-gradient-to-br from-orange-300/40 via-amber-200/20 to-transparent blur-3xl" />

                {/* Left Side Orange Dotted Grid */}
                <div
                    className="absolute left-4 sm:left-10 top-1/3 h-28 w-28 opacity-45 hidden sm:block"
                    style={{
                        backgroundImage: "radial-gradient(#f97316 1.8px, transparent 1.8px)",
                        backgroundSize: "16px 16px",
                    }}
                />

                {/* Bottom Left Flowing Light-Blue Curves */}
                <div className="absolute -bottom-14 -left-14 h-80 w-80 rounded-full bg-gradient-to-tr from-sky-300/35 via-blue-200/15 to-transparent blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-400/25 via-sky-300/10 to-transparent blur-3xl" />

                {/* Right Side Blue Dotted Grid */}
                <div
                    className="absolute right-4 sm:right-10 bottom-1/3 h-28 w-28 opacity-45 hidden sm:block"
                    style={{
                        backgroundImage: "radial-gradient(#3b82f6 1.8px, transparent 1.8px)",
                        backgroundSize: "16px 16px",
                    }}
                />

                {/* Bottom Right Flowing Light-Blue Curves */}
                <div className="absolute -bottom-14 -right-14 h-80 w-80 rounded-full bg-gradient-to-tl from-blue-400/35 via-sky-300/15 to-transparent blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tl from-sky-400/25 via-blue-200/10 to-transparent blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-xs font-bold text-blue-600">
                            <span className="h-2 w-2 rounded-full bg-[#FD8006]" />
                            Our Courses
                        </div>

                        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                            Our Popular{" "}
                            <span className="relative inline-block text-[#FD8006]">
                                Courses
                                {/* Curved underline swoosh */}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full h-2.5 text-[#FD8006]"
                                    viewBox="0 0 100 12"
                                    fill="none"
                                >
                                    <path
                                        d="M3 6 C30 11, 70 11, 97 6"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base font-normal">
                            Choose from industry-focused learning programs and start
                            your journey with ApnaVidya.
                        </p>
                    </div>

                    <Link
                        to="/courses"
                        className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-2.5 text-sm font-bold text-blue-600 shadow-xs transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-95"
                    >
                        <span>View All Courses</span>
                        <ArrowRight
                            size={16}
                            strokeWidth={2.5}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>


                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"

                >
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60 h-full"
                            style={{ boxShadow: "rgba(5, 5, 5, 0.69) 0px 19px 23px -12px", borderRadius: "10px" }}
                        >
                            <div>
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
                                            Popular Course
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 pb-0">
                                    <h3
                                        className="text-lg font-bold leading-6 text-slate-900 line-clamp-1"
                                        title={course.title}
                                    >
                                        {course.title}
                                    </h3>

                                    <p
                                        className="mt-2 h-[60px] text-sm leading-5 text-slate-500 line-clamp-3 overflow-hidden"
                                        title={course.description}
                                    >
                                        {course.description}
                                    </p>

                                    <ul className="mt-4 space-y-2.5">
                                        {course.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-2 text-xs font-medium text-slate-600"
                                            >
                                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                    <Check
                                                        size={10}
                                                        strokeWidth={3}
                                                    />
                                                </span>
                                                <span className="truncate">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="p-5 pt-4">
                                <Link
                                    to={course.path}
                                    className="group/button flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-[#FD8006] hover:text-white"
                                >
                                    View Course
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform group-hover/button:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCourses;