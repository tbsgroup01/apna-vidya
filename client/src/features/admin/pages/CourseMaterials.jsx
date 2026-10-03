import React, { useState, useEffect } from "react";
import { Plus, Download, Eye, Trash2, FileBox, Upload, FileText } from "lucide-react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import api from "../../../services/api";

const CourseMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    courseId: "",
    fileType: "PDF Document",
    visibility: "Enrolled Students",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matRes, crsRes] = await Promise.all([
        api.get("/admin/course-materials?limit=100"),
        api.get("/admin/courses?limit=100"),
      ]);

      if (matRes.data?.data?.materials) {
        setMaterials(matRes.data.data.materials);
      }
      if (crsRes.data?.data?.courses) {
        setCourses(crsRes.data.data.courses);
        if (crsRes.data.data.courses.length > 0 && !uploadForm.courseId) {
          setUploadForm((prev) => ({ ...prev, courseId: crsRes.data.data.courses[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (mat) => {
    setMaterialToDelete(mat);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (materialToDelete) {
      try {
        await api.delete(`/admin/course-materials/${materialToDelete.id}`);
        setMaterialToDelete(null);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete material");
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("title", uploadForm.title);
        formData.append("courseId", uploadForm.courseId);
        formData.append("fileType", uploadForm.fileType);
        formData.append("visibility", uploadForm.visibility);
        formData.append("file", selectedFile);

        await api.post("/admin/course-materials", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/course-materials", {
          title: uploadForm.title,
          courseId: uploadForm.courseId ? Number(uploadForm.courseId) : null,
          fileType: uploadForm.fileType,
          visibility: uploadForm.visibility,
        });
      }

      setUploadModalOpen(false);
      setSelectedFile(null);
      setUploadForm({
        title: "",
        courseId: courses[0]?.id || "",
        fileType: "PDF Document",
        visibility: "Enrolled Students",
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload material");
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Resource Title",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-bold text-[13px]late-900">{row.title}</p>
            <div className="flex items-center gap-2 text-[13px] text-[13px]late-400 mt-0.5">
              <span>{row.fileType || "PDF Document"}</span>
              <span>•</span>
              <span className="font-mono">{row.fileSize || "1.5 MB"}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-[13px]late-800">{row.course?.name || "General Program"}</span>
      ),
    },
    {
      key: "visibility",
      header: "Visibility",
      render: (row) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[13px] font-medium text-[13px]late-700">
          {row.visibility || "Enrolled Students"}
        </span>
      ),
    },
    {
      key: "uploadedBy",
      header: "Uploaded By",
      render: (row) => (
        <div>
          <p className="text-[13px]late-700 font-medium">{row.uploadedBy || "Faculty Mentor"}</p>
          <p className="text-[13px] text-[13px]late-400">
            {row.createdAt ? new Date(row.createdAt).toISOString().split("T")[0] : "Recent"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status || "Published"} size="sm" />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={row.file || "#"}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-slate-100 hover:text-[13px]late-800 transition-colors"
            title="Download / View Asset"
          >
            <Download size={15} />
          </a>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg p-1.5 text-[13px]late-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Asset"
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
        title="Course Learning Materials"
        description="Upload and organize lesson PDFs, starter repos, source code bundles, and notes for enrolled learners."
        breadcrumbs={[{ label: "Course Materials" }]}
        actions={
          <button
            type="button"
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#FD8006] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <Upload size={15} />
            <span>Upload Material</span>
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={materials}
        searchKey="title"
        searchPlaceholder="Search materials by title..."
        filterTabs={["All", "Published", "Draft"]}
        filterKey="status"
        loading={loading}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Course Material?"
        message={`Are you sure you want to remove "${materialToDelete?.title}"? Students will no longer be able to download this file.`}
        confirmText="Delete File"
        type="danger"
      />

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[13px]late-900">
              Upload New Course Resource
            </h3>
            <p className="mt-1 text-xs text-[13px]late-500">
              Select target course and configure access permissions.
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                  Material Title *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g. Masterclass Lecture Slides & Code"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                  Associated Course *
                </label>
                <select
                  value={uploadForm.courseId}
                  onChange={(e) => setUploadForm({ ...uploadForm, courseId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                    Resource Type
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option value="PDF Document">PDF Document</option>
                    <option value="Source Code Archive">Source Code Archive</option>
                    <option value="Jupyter Notebook Bundle">Jupyter Notebook Bundle</option>
                    <option value="Video Recording">Video Recording</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                    Visibility
                  </label>
                  <select
                    value={uploadForm.visibility}
                    onChange={(e) => setUploadForm({ ...uploadForm, visibility: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Enrolled Students">Enrolled Students Only</option>
                    <option value="Public">Public Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold uppercase tracking-wider text-[13px]late-700 text-[13px]">
                  Attach File
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs bg-white focus:outline-none"
                />
                <p className="mt-1 text-[12px] text-[13px]late-400">PDF, ZIP, IPYNB, MP4 up to 50MB</p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[13px]late-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-xl bg-[#FD8006] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? "Uploading..." : "Publish Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMaterials;
