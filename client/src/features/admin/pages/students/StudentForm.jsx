import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Save, User, BookOpen, CreditCard, Sparkles, Loader2, Hash } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { FormInput, FormSelect, FormTextarea, ImageUploadPreview } from "../../components/FormControls";
import api from "../../../../services/api";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const leadId = searchParams.get("leadId");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [formData, setFormData] = useState({
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    gender: "Male",
    dob: "2002-01-01",
    address: "",
    courseId: "",
    batchId: "",
    admissionDate: new Date().toISOString().split("T")[0],
    totalFees: 32000,
    paidFees: 16000,
    status: "Active",
    notes: "",
    registrationNumber: "",
    profileImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cRes, bRes] = await Promise.all([
          api.get("/admin/courses?limit=100"),
          api.get("/admin/batches?limit=100"),
        ]);
        if (cRes.data.success) {
          const courseData = cRes.data.data.courses || [];
          setCourses(courseData);
          if (!formData.courseId && courseData.length > 0) {
            setFormData((prev) => ({ ...prev, courseId: courseData[0].id }));
          }
        }
        if (bRes.data.success) {
          const batchData = bRes.data.data.batches || [];
          setBatches(batchData);
          if (!formData.batchId && batchData.length > 0) {
            setFormData((prev) => ({ ...prev, batchId: batchData[0].id }));
          }
        }
      } catch { }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api
        .get(`/admin/students/${id}`)
        .then((res) => {
          if (res.data.success && res.data.data.student) {
            const s = res.data.data.student;
            setFormData({
              name: s.name || "",
              email: s.email || "",
              phone: s.phone || "",
              gender: s.gender || "Male",
              dob: s.dob || "2002-01-01",
              address: s.address || "",
              courseId: s.enrolledCourses?.[0]?.id || "",
              batchId: s.enrolledBatches?.[0]?.id || "",
              admissionDate: s.admissionDate || new Date().toISOString().split("T")[0],
              totalFees: s.totalFees || 0,
              paidFees: s.paidFees || 0,
              status: s.status || "Active",
              notes: s.notes || "",
              registrationNumber:
                s.registrationNumber ||
                `AV-STU-${String(s.id).padStart(4, "0")}`,
              profileImage:
                s.profileImage ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (leadId) {
        await api.post(`/admin/leads/${leadId}/convert`, {
          courseId: formData.courseId,
          batchId: formData.batchId,
          totalFees: formData.totalFees,
          paidFees: formData.paidFees,
          admissionDate: formData.admissionDate,
          notes: formData.notes,
        });
      } else if (isEdit) {
        await api.put(`/admin/students/${id}`, formData);
      } else {
        await api.post("/admin/students", formData);
      }
      navigate("/admin/students");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save student profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-xs font-semibold text-[13px]late-500">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <span>Loading student profile form...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEdit ? `Edit Student: ${formData.name}` : "Enroll New Student"}
        description={
          isEdit
            ? `Update student records, fee status, and contact information for ${formData.registrationNumber || `#${id}`}.`
            : "Complete learner onboarding form with batch assignment and fee ledger."
        }
        breadcrumbs={[
          { label: "Students", path: "/admin/students" },
          { label: isEdit ? "Edit Student" : "New Student" },
        ]}
        actions={
          <Link
            to="/admin/students"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back to Directory</span>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2.5 text-[13px]late-900 font-bold text-[13px]m">
              <User size={18} className="text-blue-600" />
              <span>Personal Information</span>
            </div>
            {isEdit ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/90 px-3 py-1 font-mono text-xs font-bold text-violet-700 shadow-2xs">
                <Hash size={13} className="text-violet-500" />
                <span>{formData.registrationNumber || `AV-STU-${String(id).padStart(4, "0")}`}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[13px] font-semibold text-[13px]late-600">
                <Sparkles size={12} className="text-blue-500" />
                <span>Auto-generated Reg. Number (e.g. AV-STU-0004)</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Student Full Name"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Priyanshu Sharma"
              />
              <FormInput
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="student@example.com"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormInput
                label="Phone / WhatsApp"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
              <FormSelect
                label="Gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
              />
              <FormInput
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>

            <FormTextarea
              label="Permanent Residential Address"
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Flat / House No., Sector, City, State, PIN..."
            />

            <ImageUploadPreview
              label="Student Profile Photo"
              value={formData.profileImage}
              onChange={(url) => handleChange("profileImage", url)}
              aspect="square"
              imageClassName="object-top"
              objectPosition="top"
              helperText="Passport size photo for student identity card and batch records"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5 text-[13px]late-900 font-bold text-[13px]m">
            <BookOpen size={18} className="text-blue-600" />
            <span>Academic Program & Batch Assignment</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700">
                Enrolled Course
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => handleChange("courseId", e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-[13px]late-800 bg-white"
                required
              >
                <option value="">Select Course Program...</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (₹{c.fees})
                  </option>
                ))}
              </select>
            </div>



            <FormInput
              label="Admission Date"
              type="date"
              value={formData.admissionDate}
              onChange={(e) => handleChange("admissionDate", e.target.value)}
            />

            <FormSelect
              label="Student Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={[
                { label: "Active", value: "Active" },
                { label: "Completed", value: "Completed" },
                { label: "Dropped", value: "Dropped" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5 text-[13px]late-900 font-bold text-[13px]m">
            <CreditCard size={18} className="text-blue-600" />
            <span>Fee Structure & Payment</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Total Agreed Course Fee (₹)"
              type="number"
              value={formData.totalFees}
              onChange={(e) => handleChange("totalFees", e.target.value)}
            />
            <FormInput
              label="Initial Payment Deposited (₹)"
              type="number"
              value={formData.paidFees}
              onChange={(e) => handleChange("paidFees", e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/students"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#FD8006] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{isEdit ? "Update Student Profile" : "Enroll Student"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
