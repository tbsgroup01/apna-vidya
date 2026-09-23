import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  ArrowLeft,
  Share2,
  Calendar,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import api from "../../../services/api";
import { useBreadcrumb } from "../components/Breadcrumb";

const BlogDetails = () => {
  const { slug } = useParams();
  const { setCustomTitle } = useBreadcrumb();
  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blog?.title) {
      setCustomTitle(blog.title);
    }
  }, [blog?.title, setCustomTitle]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/public/blogs/${slug}`);
        if (res.data?.data?.blog) {
          setBlog(res.data.data.blog);
        }

        const moreRes = await api.get("/public/blogs?limit=4");
        if (moreRes.data?.data?.blogs) {
          setOtherBlogs(
            moreRes.data.data.blogs
              .filter((b) => b.slug !== slug)
              .slice(0, 2)
          );
        }
      } catch (err) {
        console.error("Failed to load article details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-24 text-center space-y-3">
        <div className="animate-spin inline-block h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-500">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-white min-h-screen py-24 text-center max-w-md mx-auto px-4 space-y-4">
        <BookOpen size={36} className="mx-auto text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900">Article Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested article may have been archived or unpublished.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
        >
          <ArrowLeft size={14} />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to All Articles</span>
        </Link>

        <div>
          <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-600">
            {blog.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            {blog.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                {blog.author?.charAt(0) || "A"}
              </div>
              <div>
                <p className="font-bold text-slate-900">{blog.author}</p>
                <p className="text-[11px] text-slate-500">{blog.authorRole || "Mentor"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {blog.publishedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {blog.readTime || "5 min read"}
              </span>
              {blog.views > 0 && (
                <span className="font-mono text-slate-400">
                  {blog.views.toLocaleString()} reads
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={
              blog.featuredImage ||
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
            }
            alt={blog.title}
            className="h-80 sm:h-96 w-full object-cover"
          />
        </div>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-slate-700">
          {blog.excerpt && (
            <p className="text-lg font-medium text-slate-900 leading-relaxed border-l-4 border-blue-600 pl-4 italic bg-slate-50 py-3 rounded-r-xl">
              {blog.excerpt}
            </p>
          )}

          <div
            className="prose prose-slate max-w-none text-slate-800 leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl prose-h3:text-xl prose-p:my-4 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-a:text-blue-600 prose-a:underline"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Found this helpful?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Share this guide with your colleagues and study group.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert("Article link copied to clipboard!");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
            >
              <Share2 size={15} />
              <span>Share Article</span>
            </button>
          </div>
        </div>

        {otherBlogs.length > 0 && (
          <div className="mt-16 border-t border-slate-100 pt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Recommended Next Reads
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {otherBlogs.map((b) => (
                <Link
                  key={b.id}
                  to={`/blog/${b.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <span className="text-xs font-bold text-blue-600">
                    {b.category}
                  </span>
                  <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {b.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {b.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogDetails;
