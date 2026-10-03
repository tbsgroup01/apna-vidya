import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  UserPlus,
  Send,
  Loader2,
  PhoneCall,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import api from "../../../../services/api";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  const fetchLead = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/leads/${id}`);
      if (res.data.success) {
        setLead(res.data.data.lead);
      }
    } catch {
      setLead(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    try {
      const res = await api.post(`/admin/leads/${id}/notes`, { text: newNote.trim() });
      if (res.data.success) {
        setNewNote("");
        fetchLead();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add note");
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await api.patch(`/admin/leads/${id}/status`, { status: newStatus });
      if (res.data.success) {
        fetchLead();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleConvertToStudent = () => {
    if (!lead) return;
    navigate(
      `/admin/students/create?name=${encodeURIComponent(
        lead.name
      )}&email=${encodeURIComponent(lead.email || "")}&phone=${encodeURIComponent(
        lead.phone
      )}&course=${encodeURIComponent(lead.course || "")}&leadId=${lead.id}`
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-xs font-semibold text-[13px]late-500">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <span>Loading lead profile...</span>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-base font-bold text-[13px]late-800">Lead Record Not Found</h3>
        <p className="mt-1 text-xs text-[13px]late-500">This lead may have been deleted or archived.</p>
        <Link
          to="/admin/leads"
          className="mt-4 inline-block rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white"
        >
          Return to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Lead: ${lead.name}`}
        description={`Enquiry reference #${lead.id} received on ${new Date(
          lead.createdAt
        ).toLocaleDateString()}`}
        breadcrumbs={[
          { label: "Leads", path: "/admin/leads" },
          { label: `#${lead.id}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {lead.phone && (
              <>
                <a
                  href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/90 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-blue-700 hover:bg-[#FD8006] hover:text-white transition-all shadow-2xs"
                  title={`Call ${lead.name} (${lead.phone})`}
                >
                  <PhoneCall size={14} />
                  <span>Call Lead</span>
                </a>
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, "").length === 10
                    ? `91${lead.phone.replace(/\D/g, "")}`
                    : lead.phone.replace(/\D/g, "")
                    }?text=${encodeURIComponent(
                      `Hello ${lead.name}, greetings from ApnaVidya!`
                    )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/90 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
                  title={`Chat on WhatsApp with ${lead.name}`}
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </>
            )}
            {lead.status !== "Converted" && (
              <button
                type="button"
                onClick={handleConvertToStudent}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
              >
                <UserPlus size={15} />
                <span>Convert to Student</span>
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-mono text-xs font-bold text-slate-400">
                #{lead.id}
              </span>
              <StatusBadge status={lead.status} />
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">
                {lead.course || "General Inquiry"}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Phone size={15} />
                </div>
                <a
                  href={`tel:${lead.phone?.replace(/\s+/g, "")}`}
                  className="font-mono font-medium text-slate-800 hover:text-blue-600 transition-colors"
                  title={`Call ${lead.name} (${lead.phone})`}
                >
                  {lead.phone}
                </a>
              </div>

              {lead.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Mail size={15} />
                  </div>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-medium text-slate-800 hover:text-blue-600 transition-colors truncate"
                    title={`Email ${lead.email}`}
                  >
                    {lead.email}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[13px]late-500">
                  <MapPin size={15} />
                </div>
                <span>{lead.city || "Not Provided"}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[13px]late-500">
                  <GraduationCap size={15} />
                </div>
                <span>{lead.qualification || "Graduate"}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[13px]late-500">
                  <UserCheck size={15} />
                </div>
                <div>
                  <p className="text-[12px] text-[13px]late-400">Assigned To</p>
                  <p className="font-bold text-[13px]late-800">{lead.assignedTo || "Unassigned"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[13px] font-bold uppercase tracking-wider text-[13px]late-400 mb-2">
                Quick Status Action
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["Contacted", "Interested", "Follow-up", "Not Interested", "Closed"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(st)}
                    className="rounded-xl border border-slate-200 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 cursor-pointer transition-all"
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-[13px]late-900 mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              <span>Counsellor Interaction Notes</span>
            </h3>

            <form onSubmit={handleAddNote} className="mb-6 space-y-3">
              <textarea
                rows={3}
                required
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log discussion notes, student preferences, fee concessions discussed..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-[13px]late-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingNote}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  <Send size={13} />
                  <span>{submittingNote ? "Adding..." : "Log Note"}</span>
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-[13px]late-900">{note.author}</span>
                      <span className="font-mono text-[12px] text-[13px]late-400">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[13px]late-700 leading-relaxed">{note.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[13px]late-400 py-4 text-center">
                  No interaction notes logged yet. Use the form above to add notes.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-[13px]late-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <span>Activity History & Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:bottom-0 before:left-2 before:top-2 before:w-0.5 before:bg-slate-200">
              {lead.timeline && lead.timeline.length > 0 ? (
                lead.timeline.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FD8006] ring-4 ring-white" />
                    <p className="text-xs font-bold text-[13px]late-900">{act.action}</p>
                    <p className="text-[13px] text-[13px]late-600 mt-0.5">{act.detail}</p>
                    <p className="text-[12px] font-mono text-[13px]late-400 mt-1">
                      {new Date(act.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[13px]late-400">No activity logged.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
