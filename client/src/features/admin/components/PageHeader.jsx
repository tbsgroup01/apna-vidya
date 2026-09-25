import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const PageHeader = ({ title, description, breadcrumbs = [], actions = null }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-[13px]late-500">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Home size={13} />
              <span>Admin</span>
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="text-[13px]late-400 shrink-0" />
                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-blue-600 transition-colors capitalize"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-[13px]late-800 capitalize">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-[13px]late-900 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[13px]m text-[13px]late-500 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
