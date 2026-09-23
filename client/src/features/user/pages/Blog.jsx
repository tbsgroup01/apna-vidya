import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ArrowRight, Newspaper, BookOpen, X } from "lucide-react";
import api from "../../../services/api";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/blogs");
        if (res.data?.data?.blogs) {
          setBlogs(res.data.data.blogs);
        }
      } catch (err) {
        console.error("Failed to fetch public blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(["All"]);
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory =
        selectedCategory === "All" || b.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        b.title?.toLowerCase().includes(query) ||
        b.excerpt?.toLowerCase().includes(query) ||
        b.author?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredBlog = useMemo(() => {
    return blogs.find((b) => b.featured) || blogs[0];
  }, [blogs]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
            <Newspaper size={15} />
            Apna Vidya Knowledge Base
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Articles & <span className="text-blue-600">Guides</span>
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Expert insights on software engineering careers, coding interviews,
            technology trends, and career development strategies.
          </p>
        </div>

        {featuredBlog && (
          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl lg:grid lg:grid-cols-12">
            <div className="lg:col-span-7 relative h-64 lg:h-auto overflow-hidden bg-slate-100">
              <img
                src={
                  featuredBlog.featuredImage ||
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                }
                alt={featuredBlog.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                Featured Guide
              </span>
            </div>
            <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-blue-600">
                    {featuredBlog.category}
                  </span>
                  <span>•</span>
                  <span>{featuredBlog.publishedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {featuredBlog.readTime}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl line-clamp-3">
                  {featuredBlog.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {featuredBlog.excerpt}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {featuredBlog.author}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {featuredBlog.authorRole || "Mentor"}
                  </p>
                </div>
                <Link
                  to={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search articles, topics, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
              >
                <div className="h-48 rounded-xl bg-slate-100" />
                <div className="h-5 w-3/4 rounded-sm bg-slate-100" />
                <div className="h-3 w-1/2 rounded-sm bg-slate-100" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-200 bg-white py-16 px-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BookOpen size={28} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              No articles match your search
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={
                        blog.featuredImage ||
                        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-600 shadow-sm backdrop-blur-xs">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{blog.publishedDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {blog.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="text-xs leading-relaxed text-slate-500 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 p-6 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{blog.author}</p>
                    <p className="text-[10px] text-slate-400">{blog.authorRole}</p>
                  </div>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
