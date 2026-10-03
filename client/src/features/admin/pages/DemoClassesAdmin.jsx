import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  Clock,
  Phone,
  Mail,
  UserCheck,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Award,
  Target,
  Sparkles,
  BookOpen,
  PhoneCall,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import ConfirmModal from "../components/ConfirmModal";
import api from "../../../services/api";

const WhatsAppIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z" />
  </svg>
);

const DemoClassesAdmin = () => {
  const navigate = useNavigate();
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [demoToUpdate, setDemoToUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("New");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [demoToDelete, setDemoToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedDemoIds, setSelectedDemoIds] = useState([]);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/leads?limit=250");
      if (res.data?.data?.leads) {
        const demoLeads = res.data.data.leads.filter(
          (l) =>
            (l.source && l.source.toLowerCase().includes("demo")) ||
            (l.message && l.message.toLowerCase().includes("demo")) ||
            (l.notes && Array.isArray(l.notes) && l.notes.some((n) => (n.text || "").toLowerCase().includes("demo")))
        );
        setDemos(demoLeads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const handleOpenStatusModal = (demo) => {
    setDemoToUpdate(demo);
    setSelectedStatus(demo.status || "New");
    setStatusModalOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!demoToUpdate) return;
    try {
      setStatusUpdating(true);
      await api.patch(`/admin/leads/${demoToUpdate.id}/status`, {
        status: selectedStatus,
      });
      setDemos((prev) =>
        prev.map((d) => (d.id === demoToUpdate.id ? { ...d, status: selectedStatus } : d))
      );
      setStatusModalOpen(false);
      setDemoToUpdate(null);
      window.dispatchEvent(new CustomEvent("demo-classes-updated"));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update demo class status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = (demo) => {
    setDemoToDelete(demo);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!demoToDelete) return;
    try {
      await api.delete(`/admin/leads/${demoToDelete.id}`);
      setDemos((prev) => prev.filter((d) => d.id !== demoToDelete.id));
      setDeleteModalOpen(false);
      setDemoToDelete(null);
      window.dispatchEvent(new CustomEvent("demo-classes-updated"));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete demo record");
    }
  };

  const handleBulkDeletePrompt = (ids) => {
    setSelectedDemoIds(ids);
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!selectedDemoIds.length) return;
    try {
      const res = await api.post("/admin/leads/bulk-delete", { ids: selectedDemoIds });
      if (res.data.success) {
        setDemos((prev) => prev.filter((d) => !selectedDemoIds.includes(d.id)));
        setBulkDeleteModalOpen(false);
        setSelectedDemoIds([]);
        window.dispatchEvent(new CustomEvent("demo-classes-updated"));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to bulk delete demo class records");
    }
  };

  const newCount = demos.filter((d) => d.status === "New").length;
  const contactedCount = demos.filter((d) => d.status === "Contacted" || d.status === "Follow-up").length;
  const interestedCount = demos.filter((d) => d.status === "Interested").length;
  const convertedCount = demos.filter((d) => d.status === "Converted").length;

  const columns = [
    {
      key: "name",
      header: "Prospective Student",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            to={`/admin/leads/${row.id}`}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors block"
          >
            {row.name}
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            {row.email && (
              <span className="flex items-center gap-1 truncate max-w-[160px]">
                <Mail size={10} />
                {row.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Target Course / Program",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-slate-800 text-xs">
          {row.course || "General Program"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Booking Channel",
      render: (row) => (
        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
          {row.source || "Demo Class"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Session Status",
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => handleOpenStatusModal(row)}
          title="Click to update status"
          className="cursor-pointer"
        >
          <StatusBadge status={row.status || "New"} size="sm" />
        </button>
      ),
    },
    {
      key: "quickConnect",
      header: "Contact",
      align: "center",
      render: (row) => {
        const rawPhone = row.phone || "";
        if (!rawPhone) {
          return <span className="text-slate-400 font-mono text-xs">—</span>;
        }
        const digits = rawPhone.replace(/\D/g, "");
        const waNumber = digits.length === 10 ? `91${digits}` : digits;
        const waUrl = digits
          ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
            `Hello ${row.name || "there"}, greetings from ApnaVidya regarding your Demo Class!`
          )}`
          : null;
        const telUrl = `tel:${rawPhone.replace(/\s+/g, "")}`;

        return (
          <div
            className="flex items-center justify-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={telUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 hover:bg-[#FD8006] text-blue-600 hover:text-white border border-blue-200/80 px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 group"
              title={`Call ${row.name || "Student"} (${rawPhone})`}
            >
              <PhoneCall size={14} className="shrink-0 text-blue-600 group-hover:text-white transition-colors" />
              <span className="font-mono">{rawPhone}</span>
            </a>
            {/* {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/80 shadow-2xs transition-all cursor-pointer active:scale-95"
                title={`Chat on WhatsApp with ${row.name || "Student"}`}
              >
                <WhatsAppIcon size={16} />
              </a>
            )} */}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (row) => (
        <div className="text-xs">
          <p className="font-mono text-slate-700">
            {new Date(row.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-[11px] text-slate-400">
            {new Date(row.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/admin/leads/${row.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="View Details"
          >
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Record"
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
        title="Demo Class Bookings"
        description="Real-time trial requests captured from the website demo modal. Coordinate counseling and track student admissions."
        breadcrumbs={[{ label: "Demo Classes" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Demo Requests"
          value={demos.length.toString()}
          icon={PlayCircle}
          color="cyan"
        />
        <StatCard
          title="New Inquiries"
          value={newCount.toString()}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Contacted & Interested"
          value={(contactedCount + interestedCount).toString()}
          icon={Target}
          color="amber"
        />
        <StatCard
          title="Converted to Student"
          value={convertedCount.toString()}
          icon={Award}
          color="emerald"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-[13px]late-500">
            <Loader2 size={18} className="animate-spin text-blue-600" />
            <span>Loading demo bookings...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={demos}
          searchKey="name"
          searchPlaceholder="Search prospective student by name, phone or course..."
          filterTabs={["All", "New", "Contacted", "Interested", "Follow-up", "Converted", "Closed"]}
          filterKey="status"
          selectable
          selectedIds={selectedDemoIds}
          onSelectionChange={setSelectedDemoIds}
          onBulkDelete={handleBulkDeletePrompt}
        />
      )}

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Bulk Delete Demo Bookings?"
        message={`Are you sure you want to permanently delete the ${selectedDemoIds.length} selected demo class registration(s)? This action cannot be undone.`}
        confirmText={`Delete (${selectedDemoIds.length}) Records`}
        confirmVariant="danger"
      />

      {statusModalOpen && demoToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[13px]late-900">
              Update Demo Session Status
            </h3>
            <p className="mt-1 text-xs text-[13px]late-500">
              Change status for <span className="font-semibold text-[13px]late-800">{demoToUpdate.name}</span>
            </p>

            <div className="mt-4 space-y-2">
              {["New", "Contacted", "Interested", "Follow-up", "Converted", "Closed"].map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${selectedStatus === st
                      ? "border-blue-600 bg-blue-50/60 text-blue-700"
                      : "border-slate-100 bg-slate-50 text-[13px]late-700 hover:bg-slate-100"
                      }`}
                  >
                    <span>{st}</span>
                    <StatusBadge status={st} size="sm" />
                  </button>
                )
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={statusUpdating}
                onClick={confirmStatusUpdate}
                className="rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {statusUpdating ? "Saving..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Demo Booking"
        message={`Are you sure you want to delete the demo registration for ${demoToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Booking"
        confirmVariant="danger"
      />
    </div>
  );
};

export default DemoClassesAdmin;
