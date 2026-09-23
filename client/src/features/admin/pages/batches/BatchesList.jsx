import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import StatCard from "../../components/StatCard";
import api from "../../../../services/api";

const BatchesList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/batches?limit=100");
      if (res.data?.data?.batches) {
        setBatches(res.data.data.batches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const activeBatches = batches.filter((b) => b.status === "Active").length;
  const upcomingBatches = batches.filter((b) => b.status === "Upcoming").length;
  const totalEnrolled = batches.reduce((acc, b) => acc + (b.batchStudents?.length || 0), 0);

  const handleDelete = (batch) => {
    setBatchToDelete(batch);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (batchToDelete) {
      try {
        await api.delete(`/admin/batches/${batchToDelete.id}`);
        setBatchToDelete(null);
        fetchBatches();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete batch");
      }
    }
  };

  const columns = [
    {
      key: "name",
      header: "Batch Name & Program",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            to={`/admin/batches/${row.id}`}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors block"
          >
            {row.name}
          </Link>
          <span className="text-xs text-blue-600 font-semibold">{row.course?.name || "General Program"}</span>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">BATCH-{row.id}</p>
        </div>
      ),
    },
    {
      key: "trainer",
      header: "Lead Mentor",
      sortable: true,
      render: (row) => (
        <span className="text-slate-800 font-semibold text-xs">{row.trainer}</span>
      ),
    },
    {
      key: "schedule",
      header: "Schedule & Timing",
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-slate-700">{row.days || "Mon, Wed, Fri"}</p>
          <p className="text-[11px] text-slate-400 font-mono">
            {row.startTime || "10:00 AM"} - {row.endTime || "01:00 PM"}
          </p>
        </div>
      ),
    },
    {
      key: "timeline",
      header: "Duration Dates",
      render: (row) => (
        <div className="text-[11px] font-mono text-slate-600">
          <p>{row.startDate || "N/A"}</p>
          <p className="text-slate-400">to {row.endDate || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "capacity",
      header: "Seats Enrolled",
      sortable: true,
      render: (row) => {
        const enrolledCount = row.batchStudents?.length || 0;
        const cap = row.capacity || 40;
        const percent = Math.min(100, Math.round((enrolledCount / cap) * 100));
        return (
          <div className="w-28">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-800 mb-1">
              <span>{enrolledCount} / {cap}</span>
              <span className="text-slate-400">{percent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percent >= 90 ? "bg-amber-500" : "bg-blue-600"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
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
          <Link
            to={`/admin/batches/${row.id}`}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Batch Details & Students"
          >
            <Eye size={15} />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Batch"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Management"
        description="Schedule live classroom batches, assign faculty trainers, monitor seat capacities, and launch video sessions."
        breadcrumbs={[{ label: "Batches" }]}
        actions={
          <Link
            to="/admin/batches/create"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Batch</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Active Live Batches"
          value={activeBatches.toString()}
          change="+12.5%"
          isPositive={true}
          comparison="currently running"
          icon="Calendar"
          color="blue"
        />
        <StatCard
          title="Upcoming Batches"
          value={upcomingBatches.toString()}
          change="Open for Admission"
          isPositive={true}
          comparison="starting next 30 days"
          icon="Clock"
          color="indigo"
        />
        <StatCard
          title="Learners in Batches"
          value={totalEnrolled.toString()}
          change="+14.2%"
          isPositive={true}
          comparison="engaged in live classes"
          icon="Users"
          color="emerald"
        />
      </div>

      <DataTable
        columns={columns}
        data={batches}
        searchKey="name"
        searchPlaceholder="Search batch by name, mentor or course..."
        filterTabs={["All", "Active", "Upcoming", "Completed"]}
        filterKey="status"
        loading={loading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Batch Schedule?"
        message={`Are you sure you want to delete "${batchToDelete?.name}"? Enrolled students will need to be reallocated to another batch.`}
        confirmText="Delete Batch"
        type="danger"
      />
    </div>
  );
};

export default BatchesList;
