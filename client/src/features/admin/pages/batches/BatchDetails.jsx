import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import api from "../../../../services/api";

const BatchDetails = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/batches/${id}`);
        if (res.data?.data?.batch) {
          setBatch(res.data.data.batch);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load batch details");
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700">
          {error || "Batch not found."}
        </div>
        <Link
          to="/admin/batches"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={15} />
          <span>Back to Batches</span>
        </Link>
      </div>
    );
  }

  const students = batch.batchStudents || [];
  const enrolledCount = students.length;
  const capacity = batch.capacity || 40;
  const availableSeats = Math.max(0, capacity - enrolledCount);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Batch: ${batch.name}`}
        description={`Program: ${batch.course?.name || "General Program"} • Lead Trainer: ${batch.trainer}`}
        breadcrumbs={[
          { label: "Batches", path: "/admin/batches" },
          { label: batch.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/batches"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </Link>
            {batch.meetLink && (
              <a
                href={batch.meetLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Video size={15} />
                <span>Launch Live Session</span>
              </a>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-1 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-mono text-xs font-bold text-slate-400">BATCH-{batch.id}</span>
            <StatusBadge status={batch.status} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{batch.name}</h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">{batch.course?.name || "General Program"}</p>
          </div>

          <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Trainer</span>
              <span className="font-bold text-slate-800">{batch.trainer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Days</span>
              <span className="font-medium text-slate-800">{batch.days || "Mon, Wed, Fri"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Class Hours</span>
              <span className="font-mono font-medium text-slate-800">
                {batch.startTime || "10:00 AM"} - {batch.endTime || "01:00 PM"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Start Date</span>
              <span className="font-mono font-medium text-slate-800">{batch.startDate || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">End Date</span>
              <span className="font-mono font-medium text-slate-800">{batch.endDate || "N/A"}</span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Seat Allocation</span>
              <span>{enrolledCount} / {capacity}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${Math.min(100, (enrolledCount / capacity) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 text-center pt-1">
              {availableSeats > 0 ? `${availableSeats} seats remaining` : "Batch is 100% full"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enrolled Learners</h3>
              <p className="text-xs text-slate-500">Students attending this batch</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              {students.length} Learners
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Enrolled On</th>
                  <th className="p-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{s.name}</td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">{s.email}</td>
                      <td className="p-3 text-slate-500">
                        {s.StudentBatch?.joinedAt ? new Date(s.StudentBatch.joinedAt).toLocaleDateString() : "Active"}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/admin/students/${s.id}`}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                      No learners currently mapped to this batch.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;
