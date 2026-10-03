import React, { useState } from "react";
import { Plus, Edit, Trash2, BellRing, ExternalLink } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { FormInput, FormSelect, FormTextarea } from "../components/FormControls";
const NotificationsAdmin = () => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("apna_admin_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveNotifications = (newList) => {
    setNotifications(newList);
    try {
      localStorage.setItem("apna_admin_notifications", JSON.stringify(newList));
    } catch { }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedNotifIds, setSelectedNotifIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    link: "/courses",
    startDate: "2026-09-20",
    endDate: "2026-10-15",
    status: "Active",
    targetAudience: "All Website Visitors",
  });

  const handleOpenCreate = () => {
    setEditingNotif(null);
    setForm({
      title: "",
      message: "",
      link: "/courses",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-10-31",
      status: "Active",
      targetAudience: "All Website Visitors",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingNotif(item);
    setForm({ ...item });
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    setNotifToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (notifToDelete) {
      const remaining = notifications.filter((n) => n.id !== notifToDelete.id);
      saveNotifications(remaining);
      setDeleteModalOpen(false);
      setNotifToDelete(null);
    }
  };

  const handleBulkDeletePrompt = (ids) => {
    setSelectedNotifIds(ids);
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = () => {
    if (!selectedNotifIds.length) return;
    const remaining = notifications.filter((n) => !selectedNotifIds.includes(n.id));
    saveNotifications(remaining);
    setBulkDeleteModalOpen(false);
    setSelectedNotifIds([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNotif) {
      const updated = notifications.map((n) =>
        n.id === editingNotif.id ? { ...form, id: n.id } : n
      );
      saveNotifications(updated);
    } else {
      const newN = {
        ...form,
        id: `NOTIF-${Date.now().toString().slice(-3)}`,
      };
      saveNotifications([newN, ...notifications]);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: "title",
      header: "Announcement Title & Message",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-[13px]late-900">{row.title}</span>
          <p className="text-xs text-[13px]late-600 line-clamp-1 mt-0.5">{row.message}</p>
          <span className="text-[13px] font-mono text-blue-600 font-semibold">{row.link}</span>
        </div>
      ),
    },
    {
      key: "targetAudience",
      header: "Target Audience",
      render: (row) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[13px] font-medium text-[13px]late-700">
          {row.targetAudience}
        </span>
      ),
    },
    {
      key: "dates",
      header: "Active Dates",
      render: (row) => (
        <div className="text-[13px] font-mono text-[13px]late-500">
          <p>{row.startDate}</p>
          <p className="text-[13px]late-400">to {row.endDate}</p>
        </div>
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
            onClick={() => handleOpenEdit(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-slate-100 hover:text-[13px]late-800 cursor-pointer"
            title="Edit Announcement"
          >
            <Edit size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-[13px]late-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            title="Delete"
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
        title="Notification Banners"
        description="Broadcast flash announcements, batch commencement alerts, and top notification bar banners across the platform."
        breadcrumbs={[{ label: "Notifications" }]}
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Announcement</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={notifications}
        searchKey="title"
        searchPlaceholder="Search notifications..."
        filterTabs={["All", "Active", "Inactive"]}
        filterKey="status"
        selectable
        selectedIds={selectedNotifIds}
        onSelectionChange={setSelectedNotifIds}
        onBulkDelete={handleBulkDeletePrompt}
      />

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Bulk Delete Announcements?"
        message={`Are you sure you want to permanently delete the ${selectedNotifIds.length} selected announcement notification(s)? They will stop appearing on the notification bar.`}
        confirmText={`Delete (${selectedNotifIds.length}) Announcements`}
        type="danger"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Announcement?"
        message={`Are you sure you want to delete notification "${notifToDelete?.title}"? It will immediately stop appearing on the top notification bar.`}
        confirmText="Delete"
        type="danger"
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[13px]late-900">
              {editingNotif ? "Edit Announcement" : "Create Announcement Bar"}
            </h3>
            <p className="mt-1 text-xs text-[13px]late-500">
              Publish a highlighted ribbon banner at the top of the website.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <FormInput
                label="Notification Title *"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. October Batch Admissions Now Open"
              />

              <FormTextarea
                label="Message Text *"
                required
                rows={2}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Brief notification description..."
              />

              <FormInput
                label="Destination Link URL"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/courses/full-stack-development"
              />

              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  label="Target Audience"
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  options={["All Website Visitors", "Enrolled Students", "Alumni"]}
                />
                <FormSelect
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  options={["Active", "Inactive"]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Start Date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
                <FormInput
                  label="End Date"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FD8006] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95"
                >
                  Save Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsAdmin;
