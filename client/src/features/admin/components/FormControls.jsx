import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Link2,
  Image as ImageIcon,
  Loader2,
  FolderUp,
  ExternalLink,
  RefreshCw,
  Sparkles,
  FileText,
  Download,
} from "lucide-react";
import api from "../../../services/api";

export const FormInput = ({
  label,
  id,
  type = "text",
  required = false,
  error = "",
  helperText = "",
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        required={required}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px]m text-[13px]late-800 placeholder-slate-400 shadow-2xs transition-all focus:outline-none focus:ring-2 ${error
          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
          : "border-slate-200 focus:border-blue-600 focus:ring-blue-100"
          } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-[13px] font-medium text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[13px] text-[13px]late-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export const FormSelect = ({
  label,
  id,
  required = false,
  options = [],
  error = "",
  helperText = "",
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={id}
        required={required}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px]m text-[13px]late-800 shadow-2xs transition-all focus:outline-none focus:ring-2 ${error
          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
          : "border-slate-200 focus:border-blue-600 focus:ring-blue-100"
          } ${className}`}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={typeof opt === "object" ? opt.value : opt}>
            {typeof opt === "object" ? opt.label : opt}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 text-[13px] font-medium text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[13px] text-[13px]late-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export const FormTextarea = ({
  label,
  id,
  rows = 4,
  required = false,
  error = "",
  helperText = "",
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[13px]late-700"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        required={required}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px]m text-[13px]late-800 placeholder-slate-400 shadow-2xs transition-all focus:outline-none focus:ring-2 ${error
          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
          : "border-slate-200 focus:border-blue-600 focus:ring-blue-100"
          } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-[13px] font-medium text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[13px] text-[13px]late-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export const ImageUploadPreview = ({
  label,
  value = "",
  onChange,
  aspect = "video",
  presets = [],
  maxSizeMB = 1,
  helperText = "",
  required = false,
}) => {
  const [mode, setMode] = useState("file");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isReplacing, setIsReplacing] = useState(false);
  const fileInputRef = useRef(null);

  const getAspectClass = () => {
    switch (aspect) {
      case "square":
        return "aspect-square max-w-[200px]";
      case "banner":
        return "aspect-21/9 max-h-48 w-full";
      case "auto":
        return "max-h-60 w-full";
      case "video":
      default:
        return "aspect-video max-h-52 w-full";
    }
  };

  const handleProcessFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|svg|gif|ico)$/i)) {
      setUploadError("Please choose a valid image file (JPG, PNG, WebP, SVG, ICO).");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`Image size must be less than ${maxSizeMB}MB.`);
      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      let res;
      try {
        res = await api.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (errAdmin) {
        res = await api.post("/public/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const uploadedUrl = res.data?.url || res.data?.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
        setIsReplacing(false);
      } else {
        const localBlob = URL.createObjectURL(file);
        onChange(localBlob);
        setIsReplacing(false);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result);
          setIsReplacing(false);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const showUploader = !value || isReplacing;

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
            {!label.toLowerCase().includes("1mb") &&
              !label.toLowerCase().includes("1 mb") &&
              !label.toLowerCase().includes("less than") &&
              !label.toLowerCase().includes("less then") && (
                <span className="ml-1.5 text-[11px] font-medium text-slate-500 normal-case tracking-normal">
                  (less than {maxSizeMB}MB)
                </span>
              )}
          </label>
          {value && !isReplacing && (
            <button
              type="button"
              onClick={() => setIsReplacing(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <RefreshCw size={11} />
              <span>Change Image</span>
            </button>
          )}
        </div>
      )}

      {value && !isReplacing ? (
        <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-2xs">
          <div className={`mx-auto overflow-hidden rounded-xl border border-slate-200 bg-white flex items-center justify-center ${getAspectClass()}`}>
            <img
              src={value}
              alt="Preview"
              className="h-full w-full"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[12px] font-bold text-emerald-700 border border-emerald-200/60">
                Active Image
              </span>
              <span className="truncate text-xs font-mono text-slate-500" title={value}>
                {value}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsReplacing(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsReplacing(false);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <X size={12} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setMode("file")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${mode === "file"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <FolderUp size={13} />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${mode === "url"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <Link2 size={13} />
                <span>Image Link</span>
              </button>
            </div>

            {value && isReplacing && (
              <button
                type="button"
                onClick={() => setIsReplacing(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          {uploadError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
              {uploadError}
            </div>
          )}

          {mode === "file" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${dragOver
                ? "border-blue-500 bg-blue-50/70"
                : "border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/30"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploading ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2 text-blue-600">
                  <Loader2 size={26} className="animate-spin" />
                  <p className="text-xs font-bold">Uploading file to server...</p>
                  <p className="text-xs text-slate-400">Saving image and generating permanent URL</p>
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-xs mb-2">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag and drop image here
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Supports PNG, JPG, JPEG, WebP, SVG, ICO • <span className="font-semibold text-blue-600">Image size must be less than {maxSizeMB}MB</span>
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="relative">
                <input
                  type="url"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {presets.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Sample Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onChange(preset.url);
                          setIsReplacing(false);
                        }}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${value === preset.url
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        <Sparkles size={11} className="text-amber-500" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {helperText && (
            <p className="text-xs text-slate-400">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const DocumentUpload = ({
  label = "Course Syllabus (PDF / Document)",
  value = "",
  onChange,
  maxSizeMB = 50,
  helperText = "Upload PDF or document syllabus that students can download from the course page.",
  required = false,
}) => {
  const [mode, setMode] = useState("file");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const handleProcessFile = async (file) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`File must be smaller than ${maxSizeMB}MB.`);
      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      let res;
      try {
        res = await api.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (errAdmin) {
        res = await api.post("/public/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const uploadedUrl = res.data?.url || res.data?.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${mode === "file"
              ? "bg-white text-blue-600 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${mode === "url"
              ? "bg-white text-blue-600 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {value ? (
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FD8006] text-white shadow-xs">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {value.split("/").pop() || "Syllabus Document"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>View</span>
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove syllabus"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {mode === "file" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${dragOver
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-slate-50"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.rar"
                onChange={(e) => handleProcessFile(e.target.files[0])}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-blue-600">
                  <Loader2 size={24} className="animate-spin" />
                  <p className="text-xs font-bold">Uploading syllabus document...</p>
                  <p className="text-[11px] text-slate-400">Storing file on server</p>
                </div>
              ) : (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-xs mb-2">
                    <Upload size={20} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag & drop syllabus document
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Supports PDF, DOC, DOCX (Max {maxSizeMB}MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="relative">
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste direct PDF or Google Drive download link (https://...)"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{uploadError}</p>
      )}
      {helperText && (
        <p className="mt-1.5 text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
