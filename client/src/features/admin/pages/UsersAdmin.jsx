import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Key, Shield, UserCheck, Loader2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import { FormInput, FormSelect, ImageUploadPreview } from "../components/FormControls";
import api from "../../../services/api";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Admin",
    status: "Active",
    avatar: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      if (res.data?.data?.users) {
        setUsers(
          res.data.data.users.map((u) => ({
            id: u.id,
            displayId: `USR-${String(u.id).padStart(3, "0")}`,
            name: u.name,
            email: u.email,
            phone: u.phone || "N/A",
            role: u.role?.name || "Admin",
            status: u.status || "Active",
            avatar: u.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never",
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "Recent",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await api.post("/admin/users", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password || "Admin@12345",
        role: form.role,
        status: form.status,
        profileImage: form.avatar,
      });
      setModalOpen(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "Admin",
        status: "Active",
        avatar: "",
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create staff account");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Staff Member",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
          />
          <div>
            <span className="font-bold text-slate-900 block">{row.name}</span>
            <span className="text-xs text-slate-400 font-mono">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Assigned Role",
      sortable: true,
      render: (row) => (
        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
          {row.role}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "Last Login",
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 font-mono text-xs">{row.lastLogin}</span>
      ),
    },
    {
      key: "status",
      header: "Account Status",
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
            onClick={() => alert(`Password reset link dispatched to ${row.email}`)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            title="Reset Password"
          >
            <Key size={14} />
          </button>
          {row.role !== "Super Admin" && (
            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              title="Disable / Delete User"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin User Management"
        description="Invite staff members, counselors, and accountants to administer student records with tailored permissions."
        breadcrumbs={[{ label: "Users" }]}
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Invite User</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search staff by name or email..."
        filterTabs={["All", "Active", "Disabled"]}
        filterKey="status"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Revoke Admin Access?"
        message={`Are you sure you want to disable ${userToDelete?.name} (${userToDelete?.role})? They will immediately lose access to the admin console.`}
        confirmText="Revoke Access"
        type="danger"
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Invite Institutional User
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Staff members will receive an activation email to establish their credentials.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <FormInput
                label="Full Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Shalini Mathur"
              />

              <FormInput
                label="Work Email Address *"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="shalini.m@apnavidya.com"
              />

              <FormInput
                label="Contact Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />

              <div className="grid grid-cols-2 gap-3">
                <FormSelect
                  label="Role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  options={[
                    "Admin",
                    "Counsellor",
                    "Accountant",
                    "Content Manager",
                  ]}
                />
                <FormSelect
                  label="Initial Status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  options={["Active", "Disabled"]}
                />
              </div>

              <ImageUploadPreview
                label="Staff Avatar Photo"
                value={form.avatar}
                onChange={(url) => setForm({ ...form, avatar: url })}
                aspect="square"
                helperText="Upload profile picture or paste an avatar URL"
              />

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
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
