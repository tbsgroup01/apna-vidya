import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Download,
  Eye,
  Trash2,
  Edit,
  Phone,
  Mail,
  UserCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../../../services/api";

const LeadsList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [leadToUpdate, setLeadToUpdate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Contacted");

  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    course: "Full Stack Web Development",
    source: "Contact Form",
    city: "",
  });

  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);
  const [coursesList, setCoursesList] = useState([]);
  const [batchesList, setBatchesList] = useState([]);
  const [convertForm, setConvertForm] = useState({
    courseId: "",
    batchId: "",
    totalFees: 32000,
    paidFees: 16000,
    admissionDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [convertLoading, setConvertLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/leads?limit=150");
      if (res.data.success) {
        const contactAndWebsiteLeads = (res.data.data.leads || []).filter(
          (l) => !l.source || !l.source.toLowerCase().includes("demo")
        );
        setLeads(contactAndWebsiteLeads);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cRes, bRes] = await Promise.all([
          api.get("/admin/courses?limit=100"),
          api.get("/admin/batches?limit=100"),
        ]);
        if (cRes.data.success) setCoursesList(cRes.data.data.courses || []);
        if (bRes.data.success) setBatchesList(bRes.data.data.batches || []);
      } catch { }
    };
    fetchOptions();
  }, []);

  const handleDelete = (lead) => {
    setLeadToDelete(lead);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;
    try {
      await api.delete(`/admin/leads/${leadToDelete.id}`);
      setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
      setDeleteModalOpen(false);
      setLeadToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lead");
    }
  };

  const handleBulkDeletePrompt = (ids) => {
    setSelectedLeadIds(ids);
    setBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (!selectedLeadIds.length) return;
    try {
      const res = await api.post("/admin/leads/bulk-delete", { ids: selectedLeadIds });
      if (res.data.success) {
        setLeads((prev) => prev.filter((l) => !selectedLeadIds.includes(l.id)));
        setBulkDeleteModalOpen(false);
        setSelectedLeadIds([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to bulk delete leads");
    }
  };

  const handleOpenStatusModal = (lead) => {
    setLeadToUpdate(lead);
    setSelectedStatus(lead.status);
    setStatusModalOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (!leadToUpdate) return;
    try {
      await api.patch(`/admin/leads/${leadToUpdate.id}/status`, {
        status: selectedStatus,
      });
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadToUpdate.id ? { ...l, status: selectedStatus } : l
        )
      );
      setStatusModalOpen(false);
      setLeadToUpdate(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/leads", newLeadForm);
      if (res.data.success && res.data.data.lead) {
        setLeads((prev) => [res.data.data.lead, ...prev]);
        setNewLeadModalOpen(false);
        setNewLeadForm({
          name: "",
          phone: "",
          email: "",
          course: "Full Stack Web Development",
          source: "Contact Form",
          city: "",
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create lead");
    }
  };

  const handleOpenConvertModal = (lead) => {
    setLeadToConvert(lead);
    const matchedCourse = coursesList.find((c) =>
      c.name.toLowerCase().includes((lead.course || "").toLowerCase())
    );
    setConvertForm({
      courseId: matchedCourse ? matchedCourse.id : (coursesList[0]?.id || ""),
      batchId: batchesList[0]?.id || "",
      totalFees: matchedCourse ? matchedCourse.fees : 32000,
      paidFees: 16000,
      admissionDate: new Date().toISOString().split("T")[0],
      notes: `Converted from lead #${lead.id}`,
    });
    setConvertModalOpen(true);
  };

  const handleConfirmConvert = async (e) => {
    e.preventDefault();
    if (!leadToConvert) return;
    setConvertLoading(true);
    try {
      const res = await api.post(`/admin/leads/${leadToConvert.id}/convert`, convertForm);
      if (res.data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadToConvert.id ? { ...l, status: "Converted" } : l))
        );
        setConvertModalOpen(false);
        setLeadToConvert(null);
        navigate(`/admin/students/${res.data.data.student.id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to convert lead");
    } finally {
      setConvertLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Phone,Email,Course,Source,Status,AssignedTo,Created"]
        .concat(
          leads.map(
            (l) =>
              `${l.id},"${l.name}","${l.phone}","${l.email || ""}","${l.course || ""}","${l.source}","${l.status}","${l.assignedTo}","${l.createdAt}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "apna_vidya_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      key: "name",
      header: "Lead Profile",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            to={`/admin/leads/${row.id}`}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
          >
            {row.name}
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 font-mono">
              <Phone size={10} />
              {row.phone}
            </span>
            {row.email && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
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
      header: "Course Interested",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-slate-800">{row.course || "General"}</span>
      ),
    },
    {
      key: "source",
      header: "Source",
      sortable: true,
      render: (row) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          {row.source}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <button
          type="button"
          onClick={() => handleOpenStatusModal(row)}
          title="Click to change status"
          className="cursor-pointer"
        >
          <StatusBadge status={row.status} size="sm" />
        </button>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {new Date(row.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status !== "Converted" && (
            <button
              type="button"
              onClick={() => handleOpenConvertModal(row)}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Convert Lead to Enrolled Student"
            >
              <UserCheck size={13} />
              <span>Convert</span>
            </button>
          )}
          <Link
            to={`/admin/leads/${row.id}`}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="View Lead Details"
          >
            <Eye size={15} />
          </Link>
          <button
            type="button"
            onClick={() => handleOpenStatusModal(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            title="Update Status"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Lead"
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
        title="Leads Management"
        description="Manage and track enquiries received from the website contact form and general admissions."
        breadcrumbs={[{ label: "Leads" }]}
        actions={
          <>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setNewLeadModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Lead</span>
            </button>
          </>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 size={18} className="animate-spin text-blue-600" />
            <span>Loading leads from live database...</span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={leads}
          searchKey="name"
          searchPlaceholder="Search leads by name, phone or email..."
          filterTabs={[
            "All",
            "New",
            "Contacted",
            "Interested",
            "Follow-up",
            "Converted",
            "Not Interested",
            "Closed",
          ]}
          filterKey="status"
          selectable
          selectedIds={selectedLeadIds}
          onSelectionChange={setSelectedLeadIds}
          onBulkDelete={handleBulkDeletePrompt}
        />
      )}

      <ConfirmModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={confirmBulkDelete}
        title="Bulk Delete Leads?"
        message={`Are you sure you want to permanently delete the ${selectedLeadIds.length} selected lead(s)? This action cannot be undone.`}
        confirmText={`Delete (${selectedLeadIds.length}) Leads`}
        type="danger"
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Lead Enquiry?"
        message={`Are you sure you want to permanently delete enquiry for "${leadToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Lead"
        type="danger"
      />

      {statusModalOpen && leadToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Update Lead Status
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Change status for <span className="font-semibold text-slate-800">{leadToUpdate.name}</span>
            </p>

            <div className="mt-4 space-y-2">
              {[
                "New",
                "Contacted",
                "Interested",
                "Follow-up",
                "Converted",
                "Not Interested",
                "Closed",
              ].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${selectedStatus === st
                      ? "border-blue-600 bg-blue-50/60 text-blue-700"
                      : "border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  <span>{st}</span>
                  <StatusBadge status={st} size="sm" />
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusUpdate}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer active:scale-95"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
      )}

      {newLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              Add New Lead Record
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Enter enquiry details received via phone, offline walk-in, or direct outreach.
            </p>

            <form onSubmit={handleCreateLead} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Ankit Sharma"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Target Course
                  </label>
                  <select
                    value={newLeadForm.course}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, course: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    {coursesList.length > 0 ? (
                      coursesList.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="Data Science & AI">Data Science & AI</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Enquiry Source
                  </label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="Contact Form">Contact Form</option>
                    <option value="Course Enquiry">Course Enquiry</option>
                    <option value="Demo Class">Demo Class</option>
                    <option value="Homepage">Homepage</option>
                    <option value="Direct Call">Direct Call</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  City / Location
                </label>
                <input
                  type="text"
                  value={newLeadForm.city}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewLeadModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer active:scale-95 shadow-sm"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {convertModalOpen && leadToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Convert Lead to Enrolled Student
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Enrolling <strong className="text-slate-800">{leadToConvert.name}</strong> ({leadToConvert.phone})
            </p>

            <form onSubmit={handleConfirmConvert} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Enrolled Course Program
                </label>
                <select
                  value={convertForm.courseId}
                  onChange={(e) => setConvertForm({ ...convertForm, courseId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white"
                  required
                >
                  <option value="">Select Course...</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (₹{c.fees})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Assign Learning Batch
                </label>
                <select
                  value={convertForm.batchId}
                  onChange={(e) => setConvertForm({ ...convertForm, batchId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 bg-white"
                >
                  <option value="">Select Batch (Optional)...</option>
                  {batchesList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.trainer})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Total Fees (₹)
                  </label>
                  <input
                    type="number"
                    value={convertForm.totalFees}
                    onChange={(e) => setConvertForm({ ...convertForm, totalFees: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Initial Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={convertForm.paidFees}
                    onChange={(e) => setConvertForm({ ...convertForm, paidFees: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConvertModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={convertLoading}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer active:scale-95 disabled:opacity-60 flex items-center gap-1.5"
                >
                  {convertLoading ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                  <span>Confirm Enrollment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
