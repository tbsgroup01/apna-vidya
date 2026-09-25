import React, { useState } from "react";
import { History, Shield, Laptop, Calendar, User } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import { initialActivityLogs } from "../../../data/admin/usersRolesData";

const ActivityLogs = () => {
  const [logs] = useState(initialActivityLogs);

  const columns = [
    {
      key: "admin",
      header: "Staff Administrator",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-[13px]late-900 block">{row.admin}</span>
          <span className="text-[13px] font-mono text-[13px]late-400">{row.ip}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action Executed",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-blue-600 text-xs">{row.action}</span>
      ),
    },
    {
      key: "module",
      header: "Module",
      sortable: true,
      render: (row) => (
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-semibold text-[13px]late-700">
          {row.module}
        </span>
      ),
    },
    {
      key: "description",
      header: "Event Description",
      render: (row) => (
        <span className="text-xs text-[13px]late-600">{row.description}</span>
      ),
    },
    {
      key: "timestamp",
      header: "Date & Time",
      sortable: true,
      render: (row) => (
        <div className="text-[13px] font-mono text-[13px]late-500">
          <p>{row.date}</p>
          <p className="text-[13px]late-400">{row.time}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Activity Logs"
        description="Immutable administrative trail recording all user creation, fee transactions, syllabus edits, and certificate issuances."
        breadcrumbs={[{ label: "Activity Logs" }]}
      />

      <DataTable
        columns={columns}
        data={logs}
        searchKey="description"
        searchPlaceholder="Search audit events by keyword, admin, or description..."
        filterTabs={["All", "Courses", "Payments", "Leads", "Certificates", "Batches"]}
        filterKey="module"
      />
    </div>
  );
};

export default ActivityLogs;
