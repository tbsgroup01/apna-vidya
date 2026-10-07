import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Gift,
  AlertTriangle,
  Flame,
  Wrench,
  Megaphone,
  CheckCircle2,
  RefreshCw,
  Eye,
  X,
  Palette,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { FormInput, FormSelect, FormTextarea } from "../components/FormControls";
import api from "../../../services/api";

const COLOR_PALETTE = [
  { name: "Brand Orange", bg: "#FD8006", text: "#ffffff" },
  { name: "Deep Purple", bg: "#581c87", text: "#fef08a" },
  { name: "Midnight Dark", bg: "#0f172a", text: "#fde047" },
  { name: "Emerald Green", bg: "#059669", text: "#ffffff" },
  { name: "Tech Blue", bg: "#1d4ed8", text: "#ffffff" },
  { name: "Crimson Red", bg: "#e11d48", text: "#ffffff" },
  { name: "Amber Gold", bg: "#d97706", text: "#ffffff" },
  { name: "Royal Indigo", bg: "#4338ca", text: "#ffffff" },
  { name: "Teal Cyan", bg: "#0d9488", text: "#ffffff" },
  { name: "Slate Charcoal", bg: "#334155", text: "#f8fafc" },
];

const getCategoryIcon = (category) => {
  switch (category) {
    case "Offer":
      return <Gift size={13} className="shrink-0" />;
    case "Festival":
      return <Flame size={13} className="shrink-0 text-amber-300" />;
    case "Maintenance":
      return <Wrench size={13} className="shrink-0 text-amber-400" />;
    case "Alert":
      return <AlertTriangle size={13} className="shrink-0 text-rose-300" />;
    case "Announcement":
    default:
      return <Megaphone size={13} className="shrink-0" />;
  }
};

const NotificationsAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    offers: 0,
    maintenance: 0,
    festivals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedNotifIds, setSelectedNotifIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "Offer",
    bgColor: "#FD8006",
    textColor: "#ffffff",
    isMarquee: true,
    speed: "normal",
    status: "Active",
    displayOrder: 1,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/alert-notifications");
      if (res.data?.success) {
        setNotifications(res.data.data.alerts || []);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenCreate = () => {
    setEditingNotif(null);
    setForm({
      title: "",
      message: "",
      category: "Offer",
      bgColor: "#FD8006",
      textColor: "#ffffff",
      isMarquee: true,
      speed: "normal",
      status: "Active",
      displayOrder: 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingNotif(item);
    setForm({
      title: item.title || "",
      message: item.message || "",
      category: item.category || "Offer",
      bgColor: item.bgColor || "#FD8006",
      textColor: item.textColor || "#ffffff",
      isMarquee: item.isMarquee !== false,
      speed: item.speed || "normal",
      status: item.status || "Active",
      displayOrder: item.displayOrder || 1,
    });
    setModalOpen(true);
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await api.patch(`/admin/alert-notifications/${item.id}/status`);
      if (res.data?.success) {
        showToast(res.data.message || "Status updated");
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = (item) => {
    setNotifToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!notifToDelete) return;
    try {
      setActionLoading(true);
      const res = await api.delete(`/admin/alert-notifications/${notifToDelete.id}`);
      if (res.data?.success) {
        showToast("Notification deleted successfully");
        setDeleteModalOpen(false);
        setNotifToDelete(null);
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete notification");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDeletePrompt = (ids) => {
    setSelectedNotifIds(ids);
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!selectedNotifIds.length) return;
    try {
      setActionLoading(true);
      const res = await api.post("/admin/alert-notifications/bulk-delete", {
        ids: selectedNotifIds,
      });
      if (res.data?.success) {
        showToast(res.data.message || "Notifications deleted");
        setBulkDeleteModalOpen(false);
        setSelectedNotifIds([]);
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to bulk delete");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (editingNotif) {
        const res = await api.put(
          `/admin/alert-notifications/${editingNotif.id}`,
          form
        );
        if (res.data?.success) {
          showToast("Notification updated successfully");
          setModalOpen(false);
          fetchNotifications();
        }
      } else {
        const res = await api.post("/admin/alert-notifications", form);
        if (res.data?.success) {
          showToast("Notification published successfully");
          setModalOpen(false);
          fetchNotifications();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save notification");
    } finally {
      setActionLoading(false);
    }
  };

  const liveActiveAlert = useMemo(() => {
    return notifications.find((n) => n.status === "Active") || notifications[0];
  }, [notifications]);

  const columns = [
    {
      key: "title",
      header: "Alert Notification & Message",
      sortable: true,
      render: (row) => (
        <div className="space-y-1 max-w-md">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${row.category === "Offer"
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : row.category === "Festival"
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : row.category === "Maintenance"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
            >
              {getCategoryIcon(row.category)}
              <span>{row.category}</span>
            </span>
            <span className="font-bold text-slate-900 text-xs">{row.title}</span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {row.message}
          </p>
        </div>
      ),
    },
    {
      key: "color",
      header: "Color Palette",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span
            className="h-7 w-7 rounded-lg border border-black/10 shadow-2xs shrink-0 flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: row.bgColor || "#FD8006", color: row.textColor || "#ffffff" }}
          >
            Aa
          </span>
          <div className="text-[11px] font-mono text-slate-600 space-y-0.5">
            <p className="font-semibold uppercase">{row.bgColor || "#FD8006"}</p>
            <p className="text-slate-400 text-[10px] uppercase">Text: {row.textColor || "#ffffff"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "style",
      header: "Motion Style",
      render: (row) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <span className="font-semibold block">
            {row.isMarquee ? "Marquee Ticker" : "Static Ribbon"}
          </span>
          <span className="text-[11px] text-slate-400 capitalize">
            {row.speed || "Normal"} Speed
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row)}
          title={`Click to ${row.status === "Active" ? "deactivate" : "activate"}`}
          className="cursor-pointer group flex items-center gap-1.5"
        >
          <StatusBadge status={row.status} size="sm" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-600 font-semibold underline">
            Toggle
          </span>
        </button>
      ),
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
            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
            title="Edit Alert"
          >
            <Edit size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Alert"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Alert Notifications & Marquee Bar"
        description="Broadcast flash promotional offers, festival wishes, batch announcements, and maintenance alerts across the client website navbar in real time."
        breadcrumbs={[{ label: "Alert Notifications" }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchNotifications}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-600 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Notification</span>
            </button>
          </div>
        }
      />

      {/* Live Client Preview Box */}
      {liveActiveAlert && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Eye size={14} className="text-blue-600" />
              <span>Live Client Website Marquee Preview (Shown Above Navbar):</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              Status: <span className="text-emerald-600 font-semibold">{liveActiveAlert.status}</span> •
              Color: <span className="font-mono font-semibold uppercase">{liveActiveAlert.bgColor || "#FD8006"}</span>
            </span>
          </div>

          <div
            className="w-full overflow-hidden rounded-xl border border-black/10 shadow-xs"
            style={{
              backgroundColor: liveActiveAlert.bgColor || "#FD8006",
              color: liveActiveAlert.textColor || "#ffffff",
            }}
          >
            <div className="flex h-9 sm:h-10 items-center justify-between px-3">
              <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-white/20">
                <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase bg-black/20 text-current border border-white/20">
                  {getCategoryIcon(liveActiveAlert.category)}
                  <span>{liveActiveAlert.category}</span>
                </span>
              </div>

              <div className="flex-1 overflow-hidden h-full flex items-center">
                <div className="animate-marquee-normal flex items-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 px-6 text-xs font-semibold">
                    <span>{liveActiveAlert.message}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 px-6 text-xs font-semibold">
                    <span>{liveActiveAlert.message}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Alerts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Megaphone size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats.total || notifications.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Live</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">{stats.active || notifications.filter(n => n.status === "Active").length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Special Offers</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Gift size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-orange-600">{stats.offers || notifications.filter(n => n.category === "Offer").length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Festival Wishes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Flame size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-purple-600">{stats.festivals || notifications.filter(n => n.category === "Festival").length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Maintenance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wrench size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{stats.maintenance || notifications.filter(n => n.category === "Maintenance").length}</p>
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={notifications}
        searchKey="title"
        searchPlaceholder="Search notifications by title or message..."
        filterTabs={["All", "Active", "Inactive"]}
        filterKey="status"
        selectable
        selectedIds={selectedNotifIds}
        onSelectionChange={setSelectedNotifIds}
        onBulkDelete={handleBulkDeletePrompt}
        loading={loading}
      />

      {/* Bulk Delete Confirm Modal */}
      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Bulk Delete Notifications?"
        message={`Are you sure you want to permanently delete the ${selectedNotifIds.length} selected notification(s)? They will stop appearing on the client marquee.`}
        confirmText={`Delete (${selectedNotifIds.length}) Notifications`}
        type="danger"
        loading={actionLoading}
      />

      {/* Single Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Notification?"
        message={`Are you sure you want to delete notification "${notifToDelete?.title}"? It will immediately stop appearing on the client marquee bar.`}
        confirmText="Delete"
        type="danger"
        loading={actionLoading}
      />

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingNotif ? "Edit Alert Notification" : "Create Alert Notification"}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Publish a highlighted marquee or ribbon banner at the very top of the website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Interactive Preview Box Inside Modal */}
            <div className="mt-5 space-y-1.5">
              <span className="block text-xs font-bold text-slate-600">
                Live Marquee Preview:
              </span>
              <div
                className="w-full overflow-hidden rounded-xl border border-black/10 shadow-xs transition-colors"
                style={{
                  backgroundColor: form.bgColor || "#FD8006",
                  color: form.textColor || "#ffffff",
                }}
              >
                <div className="flex h-9 items-center justify-between px-3">
                  <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-white/20">
                    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-black/20 text-current border border-white/20">
                      {getCategoryIcon(form.category)}
                      <span>{form.category}</span>
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden px-3">
                    <span className="text-xs font-semibold truncate block">
                      {form.message || "Enter notification message below to preview..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <FormInput
                    label="Alert Title *"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Diwali Mega Offer or Server Maintenance"
                  />
                </div>
                <div>
                  <FormSelect
                    label="Category / Purpose *"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    options={["Offer", "Festival", "Maintenance", "Announcement", "Alert"]}
                  />
                </div>
              </div>

              <FormTextarea
                label="Marquee Message Text (Displayed to Visitors) *"
                required
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write the continuous scrolling marquee announcement, offer details, coupon code, or maintenance schedule..."
              />


              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Palette size={14} className="text-blue-600" />
                    <span>Color Palette & Custom Color Picker</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Pick any custom color
                  </span>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/70">

                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 space-y-1.5">
                    <span className="block text-xs font-semibold text-slate-700">
                      Background Color
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                        <input
                          type="color"
                          value={form.bgColor}
                          onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                          className="absolute -top-2 -left-2 h-14 w-14 cursor-pointer border-0 p-0"
                          title="Click to pick background color"
                        />
                      </div>
                      <input
                        type="text"
                        value={form.bgColor}
                        onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                        placeholder="#FD8006"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-800 uppercase focus:bg-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Text Color Picker */}
                  <div className="rounded-xl bg-white p-2.5 border border-slate-200 space-y-1.5">
                    <span className="block text-xs font-semibold text-slate-700">
                      Text & Icon Color
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-slate-300 shadow-2xs">
                        <input
                          type="color"
                          value={form.textColor}
                          onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                          className="absolute -top-2 -left-2 h-14 w-14 cursor-pointer border-0 p-0"
                          title="Click to pick text color"
                        />
                      </div>
                      <input
                        type="text"
                        value={form.textColor}
                        onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                        placeholder="#ffffff"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-800 uppercase focus:bg-white focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Marquee Motion & Status Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <FormSelect
                    label="Display Style"
                    value={form.isMarquee ? "Marquee" : "Static"}
                    onChange={(e) => setForm({ ...form, isMarquee: e.target.value === "Marquee" })}
                    options={["Marquee", "Static"]}
                  />
                </div>
                <div>
                  <FormSelect
                    label="Marquee Speed"
                    value={form.speed}
                    onChange={(e) => setForm({ ...form, speed: e.target.value })}
                    options={["slow", "normal", "fast"]}
                  />
                </div>
                <div>
                  <FormSelect
                    label="Status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    options={["Active", "Inactive"]}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FD8006] px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600 active:scale-95 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingNotif ? "Save Changes" : "Publish Announcement"}</span>
                  )}
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
