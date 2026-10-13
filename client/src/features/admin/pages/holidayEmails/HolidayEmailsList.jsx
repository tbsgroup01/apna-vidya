import React, { useState, useEffect } from "react";
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
  ExternalLink,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  X,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import api from "../../../../services/api";
import { useSettings } from "../../../../context/SettingsContext";
import defaultLogo from "../../../../assets/apnavidya.png";

const HolidayEmailsList = () => {
  const { settings } = useSettings();
  const logoSrc = settings.general?.logoUrl || defaultLogo;
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({
    scheduled: 0,
    sent: 0,
    draft: 0,
    failed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [previewEmail, setPreviewEmail] = useState(null);
  const [sendingId, setSendingId] = useState(null);
  const [smtpConfigured, setSmtpConfigured] = useState(true);

  useEffect(() => {
    fetchHolidayEmails();
    checkSmtpStatus();
  }, []);

  const checkSmtpStatus = async () => {
    try {
      const res = await api.get("/admin/settings");
      if (res.data?.success && res.data?.data?.email) {
        const emailConf = res.data.data.email;
        const hasPass = Boolean(emailConf.gmailAppPassword && emailConf.gmailAppPassword.trim());
        const hasEmail = Boolean(emailConf.fromEmail && emailConf.fromEmail.includes("@"));
        setSmtpConfigured(hasPass && hasEmail);
      }
    } catch (_) {
      // Non-critical, ignore
    }
  };

  const fetchHolidayEmails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/holiday-emails");
      if (res.data?.success) {
        const data = res.data.data;
        setEmails(data.emails || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load holiday email broadcasts");
    } finally {
      setLoading(false);
    }
  };

  const handleSendNow = async (campaign) => {
    if (!campaign?.id) return;
    const confirmSend = window.confirm(
      `Send real-time holiday email for "${campaign.holidayName}" to all eligible students now?`
    );
    if (!confirmSend) return;

    try {
      setSendingId(campaign.id);
      setError("");
      setSuccessMsg("");

      const res = await api.post(`/admin/holiday-emails/${campaign.id}/send`);
      if (res.data?.success) {
        setSuccessMsg(res.data.message || `Successfully dispatched emails in real time!`);
        await fetchHolidayEmails();
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to dispatch real-time emails. Please verify your SMTP credentials in Settings > Email Configuration."
      );
    } finally {
      setSendingId(null);
    }
  };

  const handleDelete = (email) => {
    setEmailToDelete(email);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!emailToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/admin/holiday-emails/${emailToDelete.id}`);
      if (res.data?.success) {
        setSuccessMsg("Holiday email campaign deleted successfully.");
        setEmails((prev) => prev.filter((e) => e.id !== emailToDelete.id));
        setDeleteModalOpen(false);
        setEmailToDelete(null);
        await fetchHolidayEmails();
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete campaign");
    } finally {
      setDeleting(false);
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
          <span className="text-xs font-mono text-slate-400">ID #{row.id}</span>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Email Subject Line",
      sortable: true,
      render: (row) => (
        <div className="max-w-md">
          <p className="font-semibold text-slate-800 line-clamp-1 text-xs sm:text-sm">
            {row.subject}
          </p>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{row.content}</p>
        </div>
      ),
    },
    {
      key: "recipients",
      header: "Target Recipients",
      render: (row) => (
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <Users size={12} />
            <span>{row.recipients || "All Active Students"}</span>
          </span>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {row.status === "Sent"
              ? `Delivered: ${row.sentCount || row.recipientCount || 0} students`
              : `Targeting: ${row.recipientCount || 0} students`}
          </p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Holiday Date",
      sortable: true,
      render: (row) => (
        <span className="text-slate-600 font-mono text-xs font-medium">
          {row.date
            ? new Date(row.date).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            : "—"}
        </span>
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
      render: (row) => {
        const isSending = sendingId === row.id;
        const canSend = row.status !== "Sending";

        return (
          <div className="flex items-center justify-end gap-1.5">
            {canSend && (
              <button
                type="button"
                onClick={() => handleSendNow(row)}
                disabled={isSending}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200/60 disabled:opacity-50"
                title="Send real-time broadcast now"
              >
                {isSending ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>{row.status === "Sent" ? "Resend" : "Send Now"}</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setPreviewEmail(row)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              title="Preview Email"
            >
              <Eye size={15} />
            </button>

            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
              title="Delete Campaign"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Holiday Email Broadcasts"
        description="Schedule festival greetings, holiday circulars, and class suspension notifications dispatched in real-time to student inboxes."
        breadcrumbs={[{ label: "Holiday Emails" }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchHolidayEmails}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
              <span>Refresh</span>
            </button>

            <Link
              to="/admin/holiday-emails/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Compose Email</span>
            </Link>
          </div>
        }
      />

      {/* Real-time SMTP Integration Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FD8006] text-white shadow-xs">
            <Mail size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">
                Real-Time Gmail SMTP Delivery Pipeline
              </h4>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${smtpConfigured
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
              >
                {smtpConfigured ? "SMTP Configured" : "SMTP Setup Required"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Credentials are authenticated dynamically from{" "}
              <strong className="text-slate-700">Settings &gt; Email Configuration</strong>. Emails are
              dispatched live to all registered students.
            </p>
          </div>
        </div>

        <Link
          to="/admin/settings?tab=email"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 shadow-2xs transition-all shrink-0"
        >
          <span>Email Settings</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-800 animate-in fade-in">
          <AlertTriangle size={18} className="text-rose-600 shrink-0" />
          <div className="flex-1">
            <span>{error}</span>
            {error.includes("Settings") && (
              <Link
                to="/admin/settings?tab=email"
                className="ml-2 font-bold underline text-rose-900 hover:text-black"
              >
                Go to Settings &gt; Email Configuration
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Scheduled Dispatches"
          value={stats.scheduled.toString()}
          change="Queued"
          isPositive={true}
          comparison="for upcoming holidays"
          icon="Clock"
          color="blue"
        />
        <StatCard
          title="Delivered Emails"
          value={stats.sent.toString()}
          change="Real-Time"
          isPositive={true}
          comparison="dispatched to students"
          icon="Award"
          color="emerald"
        />
        <StatCard
          title="Draft Templates"
          value={stats.draft.toString()}
          change="Saved"
          isPositive={true}
          comparison="under preparation"
          icon="Mail"
          color="amber"
        />
        <StatCard
          title="Failed Bounces"
          value={stats.failed.toString()}
          change={stats.failed === 0 ? "Zero Errors" : "Attention"}
          isPositive={stats.failed === 0}
          comparison="SMTP pipeline status"
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
        loading={loading}
      />

      {/* Campaign Details & Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Broadcast Campaign Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewEmail(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Branded Header Banner - Clean white background, no blue, larger logo */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-white">
                <div className="bg-white p-5 border-b border-slate-100 text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <img
                      src={logoSrc}
                      alt="APNAVIDYA Logo"
                      className="h-12 sm:h-14 w-auto max-h-16 max-w-[260px] object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultLogo;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3.5 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Holiday Occasion:</p>
                  <p className="font-bold text-slate-800">{previewEmail.holidayName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Holiday Date:</p>
                  <p className="font-bold text-slate-800">
                    {previewEmail.date
                      ? new Date(previewEmail.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Target Audience:</p>
                  <p className="font-bold text-slate-800">{previewEmail.recipients}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Delivery Status:</p>
                  <div className="mt-0.5">
                    <StatusBadge status={previewEmail.status} size="sm" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Subject Line:</p>
                <div className="rounded-xl border border-slate-200 bg-white p-3 font-semibold text-xs sm:text-sm text-slate-900">
                  {previewEmail.subject}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Email Body Content:</p>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 font-sans text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                  {previewEmail.content}
                </div>
              </div>

              {previewEmail.deliveryLogs && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Delivery Telemetry:</p>
                  <p className="text-slate-600">
                    Sent successfully to:{" "}
                    <strong>{previewEmail.deliveryLogs.sentCount || previewEmail.sentCount || 0}</strong> students
                  </p>
                  {previewEmail.deliveryLogs.senderEmail && (
                    <p className="text-slate-600">
                      Dispatched from:{" "}
                      <code className="text-blue-600 font-mono font-bold">
                        {previewEmail.deliveryLogs.senderEmail}
                      </code>
                    </p>
                  )}
                  {previewEmail.sentAt && (
                    <p className="text-slate-500 text-[11px]">
                      Timestamp: {new Date(previewEmail.sentAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setPreviewEmail(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = previewEmail;
                  setPreviewEmail(null);
                  handleSendNow(target);
                }}
                disabled={sendingId === previewEmail.id}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>{previewEmail.status === "Sent" ? "Resend Broadcast" : "Send Now"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Holiday Campaign?"
        message={`Are you sure you want to delete the "${emailToDelete?.holidayName}" email campaign?`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        type="danger"
      />
    </div>
  );
};

export default HolidayEmailsList;
