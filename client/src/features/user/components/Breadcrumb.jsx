import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ChevronRight, ArrowLeft } from "lucide-react";

const BreadcrumbContext = createContext({
  customTitle: null,
  setCustomTitle: () => { },
});

export const BreadcrumbProvider = ({ children }) => {
  const [customTitle, setCustomTitle] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setCustomTitle(null);
  }, [location.pathname]);

  return (
    <BreadcrumbContext.Provider value={{ customTitle, setCustomTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);

const ROUTE_LABELS = {
  about: "About Us",
  courses: "Courses",
  syllabus: "Curriculum & Syllabus",
  "demo-class": "Book a Demo Class",
  blog: "Blog & Insights",
  contact: "Contact Us",
  "verify-certificate": "Verify Certificate",
  "privacy-policy": "Privacy Policy",
  terms: "Terms & Conditions",
  "terms-and-conditions": "Terms & Conditions",
  "refund-policy": "Refund Policy",
};

const formatSegment = (str) => {
  if (!str) return "";
  const lower = str.toLowerCase();
  if (ROUTE_LABELS[lower]) {
    return ROUTE_LABELS[lower];
  }
  return decodeURIComponent(str)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customTitle } = useBreadcrumb();

  const pathname = location.pathname;
  if (
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/student") ||
    pathname === "/login" ||
    pathname === "/admin/login"
  ) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, idx) => {
    const url = "/" + segments.slice(0, idx + 1).join("/");
    const isLast = idx === segments.length - 1;
    const label = isLast && customTitle ? customTitle : formatSegment(seg);
    return {
      name: seg,
      url,
      label,
      isLast,
    };
  });

  return (
    <div className="bg-slate-50/90 border-b border-slate-200/80 py-2.5 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-[13px]late-500 overflow-x-auto py-0.5 no-scrollbar"
          >
            <Link
              to="/"
              className="group flex items-center gap-1.5 hover:text-blue-600 transition-colors shrink-0"
            >
              <Home
                size={13}
                className="text-[13px]late-400 group-hover:text-blue-600 transition-colors"
              />
              <span>Home</span>
            </Link>

            {crumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.url || idx}>
                <ChevronRight size={13} className="text-[13px]late-300 shrink-0" />
                {crumb.isLast ? (
                  <span
                    className="font-semibold text-[13px]late-800 line-clamp-1 max-w-[200px] sm:max-w-md shrink-0"
                    title={crumb.label}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.url}
                    className="hover:text-blue-600 transition-colors shrink-0"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[13px]late-500 hover:text-[13px]late-800 transition-colors cursor-pointer shrink-0 ml-auto"
            title="Go to previous page"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
