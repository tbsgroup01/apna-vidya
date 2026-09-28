import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_sidebar_open");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_open", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex print:bg-white print:block print:min-h-0">
      <div className="print:hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-0"
        } print:pl-0 print:block print:w-full`}
      >
        <div className="print:hidden">
          <Topbar
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:block print:w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
