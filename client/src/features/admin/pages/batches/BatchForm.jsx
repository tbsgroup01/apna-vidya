import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, CalendarDays } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { FormInput, FormSelect } from "../../components/FormControls";
import api from "../../../../services/api";

const BatchForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    trainer: "Dr. Vikramaditya Sen",
    startDate: "2026-11-07",
    endDate: "2027-05-15",
    startTime: "10:00 AM",
    endTime: "01:00 PM",
    days: "Sat, Sun",
    capacity: 40,
    status: "Upcoming",
    meetLink: "https://meet.google.com/apn-live-batch",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/admin/courses?limit=100");
        if (res.data?.data?.courses) {
          setCoursesList(res.data.data.courses);
          if (!formData.courseId && res.data.data.courses.length > 0) {
            setFormData((prev) => ({ ...prev, courseId: res.data.data.courses[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchBatch = async () => {
        try {
          const res = await api.get(`/admin/batches/${id}`);
          if (res.data?.data?.batch) {
            const b = res.data.data.batch;
            setFormData({
              name: b.name || "",
              courseId: b.courseId || "",
              trainer: b.trainer || "",
              startDate: b.startDate || "",
              endDate: b.endDate || "",
              startTime: b.startTime || "10:00 AM",
              endTime: b.endTime || "01:00 PM",
              days: b.days || "Sat, Sun",
              capacity: b.capacity || 40,
              status: b.status || "Upcoming",
              meetLink: b.meetLink || "",
            });
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load batch");
        }
      };
      fetchBatch();
    }
  }, [id, isEdit]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        courseId: formData.courseId ? Number(formData.courseId) : null,
        trainer: formData.trainer,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        days: formData.days,
        capacity: Number(formData.capacity),
        status: formData.status,
        meetLink: formData.meetLink,
      };

      if (isEdit) {
        await api.put(`/admin/batches/${id}`, payload);
      } else {
        await api.post("/admin/batches", payload);
      }
      navigate("/admin/batches");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save batch");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={isEdit ? `Edit Batch: ${formData.name}` : "Schedule New Batch"}
        description="Define live session timing, select the mentor, and set enrollment seat limits."
        breadcrumbs={[
          { label: "Batches", path: "/admin/batches" },
          { label: isEdit ? "Edit Batch" : "Create Batch" },
        ]}
        actions={
          <Link
            to="/admin/batches"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </Link>
        }
      />

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-2 text-slate-900 font-bold text-sm">
            <CalendarDays size={18} className="text-blue-600" />
            <span>Batch & Faculty Configuration</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Batch Name / Code"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. FS-NOV-26 (Weekend Live)"
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Associated Course <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => handleChange("courseId", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-2xs transition-all focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Course</option>
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              label="Assigned Lead Trainer"
              value={formData.trainer}
              onChange={(e) => handleChange("trainer", e.target.value)}
              options={[
                "Dr. Vikramaditya Sen",
                "Er. Neha Kashyap",
                "Amitabh Roy",
                "Rahul Verma",
                "Rajesh Mehrotra",
              ]}
            />
            <FormSelect
              label="Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={["Upcoming", "Active", "Completed", "Cancelled"]}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Batch Start Date"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
            <FormInput
              label="Expected Completion Date"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput
              label="Schedule Days"
              value={formData.days}
              onChange={(e) => handleChange("days", e.target.value)}
              placeholder="e.g. Sat, Sun or Mon, Wed, Fri"
            />
            <FormInput
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              placeholder="10:00 AM"
            />
            <FormInput
              label="End Time"
              value={formData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              placeholder="01:00 PM"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Seat Capacity Limit"
              type="number"
              required
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", Number(e.target.value))}
            />
            <FormInput
              label="Live Classroom Meeting URL"
              value={formData.meetLink}
              onChange={(e) => handleChange("meetLink", e.target.value)}
              placeholder="https://meet.google.com/..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/admin/batches"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>{loading ? "Saving..." : isEdit ? "Update Batch" : "Create Batch Schedule"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BatchForm;
