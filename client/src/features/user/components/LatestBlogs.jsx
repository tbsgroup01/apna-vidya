import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import api from "../../../services/api";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/public/blogs?limit=3");
        if (res.data?.data?.blogs) {
          setBlogs(res.data.data.blogs.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch latest blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (!loading && blogs.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600">
              <Newspaper size={14} />
              Educational Insights
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Latest from Our <span className="text-blue-600">Blog</span>
            </h2>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Articles, career guides, interview preparation tips, and study
              strategies curated by top educators.
            </p>
          </div>

          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 cursor-pointer"
          >
            <span>View All Articles</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={
                      blog.featuredImage ||
                      blog.image ||
                      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-600 shadow-sm backdrop-blur-xs">
                    {blog.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{blog.publishedDate || blog.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {blog.readTime || "5 min read"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {blog.excerpt || blog.summary}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-medium text-slate-600">
                      By {blog.author}
                    </span>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <span>Read More</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;
