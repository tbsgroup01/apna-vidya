import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Mail,
  Send,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import {
  holidayEmailStats,
  initialHolidayEmails,
} from "../../../../data/admin/holidayEmailsData";

const HolidayEmailsList = () => {
  const [emails, setEmails] = useState(initialHolidayEmails);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  const handleDelete = (email) => {
    setEmailToDelete(email);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (emailToDelete) {
      setEmails(emails.filter((e) => e.id !== emailToDelete.id));
      setEmailToDelete(null);
    }
  };

  const columns = [
    {
      key: "holidayName",
      header: "Holiday & Event",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.holidayName}</span>
          <span className="text-[11px] font-mono text-slate-400">{row.id}</span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Email Subject Line",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800 line-clamp-1">{row.subject}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{row.content}</p>
        </div>
      ),
    },
    {
      key: "recipients",
      header: "Target Recipients",
      render: (row) => (
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
          {row.recipients} ({row.recipientCount.toLocaleString()})
        </span>
      ),
    },
    {
      key: "date",
      header: "Holiday Date",
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 font-mono text-xs">{row.date}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Campaign"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Holiday Email Broadcasts"
        description="Schedule holiday notices, festival greetings, and class suspension circulars dispatched directly to student inboxes."
        breadcrumbs={[{ label: "Holiday Emails" }]}
        actions={
          <Link
            to="/admin/holiday-emails/create"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>Compose Email</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Scheduled Dispatches"
          value={holidayEmailStats.scheduled.toString()}
          change="Queued"
          isPositive={true}
          comparison="for upcoming holidays"
          icon="Clock"
          color="blue"
        />
        <StatCard
          title="Delivered Emails"
          value={holidayEmailStats.sent.toString()}
          change="99.4% delivery"
          isPositive={true}
          comparison="successfully sent"
          icon="Award"
          color="emerald"
        />
        <StatCard
          title="Draft Templates"
          value={holidayEmailStats.draft.toString()}
          change="Saved"
          isPositive={true}
          comparison="under preparation"
          icon="Mail"
          color="amber"
        />
        <StatCard
          title="Failed Bounces"
          value={holidayEmailStats.failed.toString()}
          change="Zero Errors"
          isPositive={true}
          comparison="healthy SMTP pipeline"
          icon="AlertCircle"
          color="indigo"
        />
      </div>

      <DataTable
        columns={columns}
        data={emails}
        searchKey="holidayName"
        searchPlaceholder="Search campaigns by holiday or subject..."
        filterTabs={["All", "Scheduled", "Sent", "Draft"]}
        filterKey="status"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Holiday Campaign?"
        message={`Are you sure you want to delete "${emailToDelete?.holidayName}" email campaign?`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default HolidayEmailsList;
