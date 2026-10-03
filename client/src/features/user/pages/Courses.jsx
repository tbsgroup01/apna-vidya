import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Check,
  ArrowRight,
  Filter,
  GraduationCap,
} from "lucide-react";
import api from "../../../services/api";
import { coursesData as fallbackCourses } from "../../../data/coursesData";

const defaultCategories = [
  "All",
  "Web Development",
  "Frontend",
  "Computer Science",
  "Mobile",
  "Data & AI",
  "School Academics",
];

const Courses = () => {
  const [courses, setCourses] = useState(fallbackCourses);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [crsRes, catRes] = await Promise.all([
          api.get("/public/courses?limit=100"),
          api.get("/public/categories"),
        ]);

        if (catRes.data?.data?.categories && catRes.data.data.categories.length > 0) {
          const catNames = ["All", ...catRes.data.data.categories.map((c) => c.name)];
          setCategories(catNames);
        }

        if (crsRes.data?.data?.courses && crsRes.data.data.courses.length > 0) {
          const mapped = crsRes.data.data.courses.map((c) => ({
            id: c.id,
            title: c.name,
            slug: c.slug,
            category: c.category?.name || "Web Development",
            description: c.description || "Comprehensive skill-building program.",
            duration: c.duration || "6 Months",
            level: c.level || "Beginner to Advanced",
            rating: "4.9",
            studentsCount: "1,200+",
            price: `₹${Number(c.fees || 0).toLocaleString()}`,
            originalPrice: `₹${Math.round(Number(c.fees || 30000) * 1.5).toLocaleString()}`,
            image: c.image || "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
            badge: c.featured ? "Bestseller" : "Popular",
            features: [
              c.duration || "6 Months",
              c.level || "Beginner to Advanced",
              "Live Interactive Classes",
              "Certification & Projects",
            ],
          }));
          setCourses(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" ||
      course.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <GraduationCap size={15} />
            Skill-Building Programs
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[13px]late-900 sm:text-5xl">
            Explore All <span className="text-blue-600">Courses</span>
          </h1>
          <p className="mt-3 text-base text-[13px]late-600">
            Gain industry-demanded software engineering skills and academic
            excellence with step-by-step mentor guidance.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px]late-400"
            />
            <input
              type="text"
              placeholder="Search courses by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-[13px]m text-[13px]late-800 placeholder-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-[13px]late-400 mr-1 hidden sm:inline" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${selectedCategory === cat
                  ? "bg-[#FD8006] text-white shadow-sm"
                  : "bg-white text-[13px]late-600 border border-slate-200 hover:bg-slate-100"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-600 shadow-sm backdrop-blur-xs">
                    {course.badge}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-[13px]late-500">
                    <span className="font-semibold text-blue-600">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-[13px]late-700">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-[13px]late-400">({course.studentsCount})</span>
                    </div>
                  </div>

                  <h3 className="mt-2 text-xl font-bold text-[13px]late-900 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[13px]late-500 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs font-medium text-[13px]late-600">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-[13px]late-400" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} className="text-[13px]late-400" />
                      {course.level}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-[13px]late-600">
                    {course.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 p-6 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-[13px]late-900">
                      {course.price}
                    </span>
                    <span className="ml-2 text-xs text-[13px]late-400 line-through">
                      {course.originalPrice}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-bold text-[13px]late-700">
              No courses matched your query &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 rounded-xl bg-[#FD8006] px-5 py-2.5 text-[13px]m font-semibold text-white hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
