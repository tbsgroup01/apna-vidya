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
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import ConfirmModal from "../components/ConfirmModal";
import api from "../../../services/api";

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
      const res = await api.get("/admin/leads?limit=150");
      if (res.data?.data?.leads) {
        const demoLeads = res.data.data.leads.filter(
          (l) =>
            (l.source && l.source.toLowerCase().includes("demo")) ||
            (l.message && l.message.toLowerCase().includes("demo"))
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
            className="font-bold text-[13px]late-900 hover:text-blue-600 transition-colors block"
          >
            {row.name}
          </Link>
          <div className="flex items-center gap-2 text-[13px] text-[13px]late-400 mt-0.5">
            <span className="flex items-center gap-1 font-mono text-[13px]late-600">
              <Phone size={10} />
              {row.phone}
            </span>
            {row.email && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 truncate max-w-[160px]">
                  <Mail size={10} />
                  {row.email}
                </span>
              </>
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
        <span className="font-semibold text-[13px]late-800 text-xs">
          {row.course || "General Program"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Booking Channel",
      render: (row) => (
        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[13px] font-bold text-blue-700">
          {row.source || "Demo Class"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Registration Date",
      sortable: true,
      render: (row) => (
        <div className="text-xs">
          <p className="font-mono text-[13px]late-700">
            {new Date(row.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-[12px] text-[13px]late-400">
            {new Date(row.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
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
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/admin/leads/${row.id}`}
            className="p-1.5 rounded-lg text-[13px]late-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="View Details"
          >
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-[13px]late-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
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
