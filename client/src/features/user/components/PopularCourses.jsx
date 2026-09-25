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
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                            Our Courses
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-[13px]late-900 sm:text-4xl">
                            Our Popular{" "}
                            <span className="text-blue-600">
                                Courses
                            </span>
                        </h2>

                        <p className="mt-3 text-[13px]m leading-6 text-[13px]late-500 sm:text-base">
                            Choose from industry-focused training programs and start
                            your learning journey with Apna Vidya.
                        </p>
                    </div>

                    <Link
                        to="/courses"
                        className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-[13px]m font-semibold text-blue-600 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                        View All Courses
                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                        >
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

                            <div className="p-5">
                                <h3 className="text-lg font-bold leading-6 text-[13px]late-900">
                                    {course.title}
                                </h3>

                                <p className="mt-2 min-h-[60px] text-[13px]m leading-5 text-[13px]late-500">
                                    {course.description}
                                </p>

                                <ul className="mt-4 space-y-2.5">
                                    {course.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2 text-xs font-medium text-[13px]late-600"
                                        >
                                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                <Check
                                                    size={10}
                                                    strokeWidth={3}
                                                />
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to={course.path}
                                    className="group/button mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-[13px]m font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
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