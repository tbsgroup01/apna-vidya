import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Upload,
  Link2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Play,
  Film,
  ExternalLink,
  Image as ImageIcon,
  FileVideo,
  Sparkles,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../../../services/api";

export const getEmbedVideoInfo = (url = "") => {
  if (!url || typeof url !== "string") {
    return { type: "empty", src: "" };
  }

  const trimmed = url.trim();

  // YouTube match (watch?v=, youtu.be/, embed/, shorts/)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
      videoId: ytMatch[1],
      defaultThumbnail: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
      videoId: vimeoMatch[1],
      defaultThumbnail: "",
    };
  }

  // Direct video file or server upload
  return {
    type: "video",
    src: trimmed,
    defaultThumbnail: "",
  };
};

const DEFAULT_VIDEOS = [
  {
    id: 1,
    title: "Why Learn With APNAVIDYA",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Full Stack Web Development Overview",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "1-on-1 Mentorship & Live Sessions",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Student Project & Placement Stories",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  },
];

const VideoSectionAdmin = () => {
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingPosterIndex, setUploadingPosterIndex] = useState(null);
  const [notification, setNotification] = useState(null);

  const fileInputRefs = useRef({});
  const posterInputRefs = useRef({});

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/video-section");
      const incoming = res.data?.data?.videoSection;
      if (incoming) {
        setIsActive(typeof incoming.isActive === "boolean" ? incoming.isActive : true);
        if (Array.isArray(incoming.videos) && incoming.videos.length > 0) {
          setVideos(incoming.videos.slice(0, 5));
        } else {
          setVideos(DEFAULT_VIDEOS);
        }
      }
    } catch {
      try {
        const pubRes = await api.get("/public/video-section");
        const incomingPub = pubRes.data?.data?.videoSection;
        if (incomingPub) {
          setIsActive(
            typeof incomingPub.isActive === "boolean" ? incomingPub.isActive : true
          );
          if (Array.isArray(incomingPub.videos) && incomingPub.videos.length > 0) {
            setVideos(incomingPub.videos.slice(0, 5));
          } else {
            setVideos(DEFAULT_VIDEOS);
          }
        }
      } catch {
        setVideos(DEFAULT_VIDEOS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/video-section", {
        videos: videos.slice(0, 5),
        isActive,
      });
      showToast("Home video carousel saved and updated live on the website!");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update video carousel",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddVideo = () => {
    if (videos.length >= 5) {
      showToast("You can add up to 5 videos maximum.", "error");
      return;
    }
    const newVideo = {
      id: Date.now(),
      title: `Video ${videos.length + 1}`,
      videoSourceType: "url",
      videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      thumbnailUrl: "",
    };
    setVideos([...videos, newVideo]);
  };

  const handleRemoveVideo = (index) => {
    if (videos.length <= 1) {
      showToast("At least 1 video is required in the section.", "error");
      return;
    }
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleUpdateVideo = (index, field, value) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], [field]: value };

    // If user typed a YouTube link and no thumbnail is set yet, auto-populate YouTube thumbnail
    if (field === "videoUrl") {
      const parsed = getEmbedVideoInfo(value);
      if (parsed.type === "youtube" && parsed.defaultThumbnail && !updated[index].thumbnailUrl) {
        updated[index].thumbnailUrl = parsed.defaultThumbnail;
      }
    }

    setVideos(updated);
  };

  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    const validVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-matroska",
    ];

    const isVideo =
      validVideoTypes.includes(file.type) ||
      file.name.match(/\.(mp4|webm|ogg|mov|mkv)$/i);

    if (!isVideo) {
      showToast("Please choose a valid video file (MP4, WebM, OGG, MOV).", "error");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      showToast("Video file exceeds maximum allowable size (100 MB).", "error");
      return;
    }

    setUploadingIndex(index);
    setUploadProgress(15);

    try {
      const formData = new FormData();
      formData.append("video", file);

      setUploadProgress(40);

      let res;
      try {
        res = await api.post("/admin/video-section/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(Math.min(95, Math.max(20, percentCompleted)));
          },
        });
      } catch {
        res = await api.post("/public/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setUploadProgress(100);

      const fileUrl = res.data?.url || res.data?.data?.url;
      if (fileUrl) {
        handleUpdateVideo(index, "videoUrl", fileUrl);
        handleUpdateVideo(index, "videoSourceType", "upload");
        showToast(`Video ${index + 1} uploaded successfully!`);
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to upload video", "error");
    } finally {
      setUploadingIndex(null);
      setUploadProgress(0);
      if (fileInputRefs.current[index]) fileInputRefs.current[index].value = "";
    }
  };

  const handlePosterUpload = async (index, file) => {
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      showToast("Thumbnail image must be less than 1MB.", "error");
      return;
    }

    setUploadingPosterIndex(index);
    try {
      const formData = new FormData();
      formData.append("image", file);

      let res;
      try {
        res = await api.post("/admin/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        res = await api.post("/public/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const fileUrl = res.data?.url || res.data?.data?.url;
      if (fileUrl) {
        handleUpdateVideo(index, "thumbnailUrl", fileUrl);
        showToast(`Thumbnail for Video ${index + 1} updated!`);
      }
    } catch {
      showToast("Failed to upload thumbnail image", "error");
    } finally {
      setUploadingPosterIndex(null);
      if (posterInputRefs.current[index]) posterInputRefs.current[index].value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl transition-all ${notification.type === "error"
            ? "bg-rose-600 text-white"
            : "bg-emerald-600 text-white"
            }`}
        >
          {notification.type === "error" ? (
            <AlertCircle size={20} className="shrink-0" />
          ) : (
            <CheckCircle2 size={20} className="shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="border-b border-slate-200/80 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <PageHeader
          title="Home Video Carousel"
          breadcrumbs={[
            { label: "Content", path: "/admin/blogs" },
            { label: "Video Carousel" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
              >
                <Eye size={14} />
                <span>View Homepage</span>
                <ExternalLink size={12} className="text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FD8006] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Carousel</span>
                  </>
                )}
              </button>
            </div>
          }
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Status & Summary Bar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-slate-900">
                Why APNAVIDYA - Video Showcase Carousel
              </h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {videos.length} / 5 Videos
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Paste video links (YouTube, Vimeo, MP4) or upload video files with thumbnails.
              Client side displays 4 videos at a time in a responsive carousel.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Section Status:</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-[#FD8006] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {videos.length < 4 && (
              <button
                type="button"
                onClick={() => setVideos(DEFAULT_VIDEOS.slice(0, 4))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles size={13} className="text-amber-500" />
                <span>Load 4 Samples</span>
              </button>
            )}

            {videos.length < 5 && (
              <button
                type="button"
                onClick={handleAddVideo}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors shadow-2xs cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Video</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex h-72 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <RefreshCw size={28} className="animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading videos...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {videos.map((vid, index) => {
              const videoInfo = getEmbedVideoInfo(vid.videoUrl);
              const isUploadingThisVideo = uploadingIndex === index;
              const isUploadingThisPoster = uploadingPosterIndex === index;

              return (
                <div
                  key={vid.id || index}
                  className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FD8006] text-xs font-bold text-white shadow-2xs">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Video #{index + 1}
                      </span>
                      {index < 4 && (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          Visible in initial view
                        </span>
                      )}
                      {index >= 4 && (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          Accessible via carousel arrow
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {videos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove video"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left 8 Cols: Title, Video URL/Upload, Thumbnail */}
                    <div className="space-y-4 lg:col-span-8">
                      {/* Video Title */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Video Title / Caption (Optional)
                        </label>
                        <input
                          type="text"
                          value={vid.title || ""}
                          onChange={(e) =>
                            handleUpdateVideo(index, "title", e.target.value)
                          }
                          placeholder="e.g. Why Learn With APNAVIDYA"
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>

                      {/* Video Source Switcher */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Video Source <span className="text-rose-500">*</span>
                          </label>
                          <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateVideo(index, "videoSourceType", "url")
                              }
                              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${vid.videoSourceType !== "upload"
                                ? "bg-white text-blue-600 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                              <Link2 size={12} />
                              <span>Video Link</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateVideo(index, "videoSourceType", "upload")
                              }
                              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${vid.videoSourceType === "upload"
                                ? "bg-white text-blue-600 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                              <Upload size={12} />
                              <span>Upload File</span>
                            </button>
                          </div>
                        </div>

                        {/* Mode 1: Paste Video Link */}
                        {vid.videoSourceType !== "upload" ? (
                          <div className="space-y-1.5">
                            <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <Link2 size={15} />
                              </div>
                              <input
                                type="url"
                                required
                                value={vid.videoUrl || ""}
                                onChange={(e) =>
                                  handleUpdateVideo(index, "videoUrl", e.target.value)
                                }
                                placeholder="Paste YouTube link (https://www.youtube.com/watch?v=...), Vimeo, or MP4 link"
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>
                                Format:{" "}
                                <strong className="text-slate-700">
                                  {videoInfo.type === "youtube"
                                    ? "YouTube Video"
                                    : videoInfo.type === "vimeo"
                                      ? "Vimeo Video"
                                      : videoInfo.type === "video"
                                        ? "Direct MP4 File"
                                        : "Empty / Invalid URL"}
                                </strong>
                              </span>
                              {videoInfo.type === "youtube" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateVideo(
                                      index,
                                      "thumbnailUrl",
                                      videoInfo.defaultThumbnail
                                    )
                                  }
                                  className="text-blue-600 hover:underline"
                                >
                                  Use YouTube thumbnail
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Mode 2: Upload Video File */
                          <div className="space-y-2">
                            <input
                              ref={(el) => (fileInputRefs.current[index] = el)}
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska"
                              onChange={(e) =>
                                handleVideoUpload(index, e.target.files?.[0])
                              }
                              className="hidden"
                            />
                            <div
                              onClick={() => {
                                if (
                                  !isUploadingThisVideo &&
                                  fileInputRefs.current[index]
                                ) {
                                  fileInputRefs.current[index].click();
                                }
                              }}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-5 text-center cursor-pointer hover:border-blue-400 hover:bg-slate-50/50 transition-all"
                            >
                              {isUploadingThisVideo ? (
                                <div className="flex flex-col items-center gap-2">
                                  <RefreshCw
                                    size={24}
                                    className="animate-spin text-blue-600"
                                  />
                                  <p className="text-xs font-bold text-slate-800">
                                    Uploading ({uploadProgress}%)...
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1.5">
                                  <FileVideo size={24} className="text-blue-600" />
                                  <p className="text-xs font-bold text-slate-800">
                                    Click to select or drop video file (Max 100 MB)
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    Supports MP4, WebM, OGG, MOV
                                  </p>
                                </div>
                              )}
                            </div>
                            {vid.videoUrl && (
                              <p className="truncate text-[11px] font-mono text-slate-600">
                                Current file: {vid.videoUrl}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Video Thumbnail */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Custom Thumbnail / Poster
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              posterInputRefs.current[index]?.click()
                            }
                            disabled={isUploadingThisPoster}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                          >
                            <ImageIcon size={12} />
                            <span>
                              {isUploadingThisPoster ? "Uploading..." : "Upload Image (less than 1MB)"}
                            </span>
                          </button>
                        </div>

                        <input
                          ref={(el) => (posterInputRefs.current[index] = el)}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handlePosterUpload(index, e.target.files?.[0])
                          }
                          className="hidden"
                        />

                        <input
                          type="url"
                          value={vid.thumbnailUrl || ""}
                          onChange={(e) =>
                            handleUpdateVideo(index, "thumbnailUrl", e.target.value)
                          }
                          placeholder="Paste image URL or upload above"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Image size must be less than 1MB</p>
                      </div>
                    </div>

                    {/* Right 4 Cols: Mini Player / Thumbnail Preview */}
                    <div className="flex flex-col lg:col-span-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Video Preview
                      </label>

                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-2xs">
                        {videoInfo.type === "youtube" || videoInfo.type === "vimeo" ? (
                          <iframe
                            src={videoInfo.src}
                            title={`Preview ${index + 1}`}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : videoInfo.type === "video" && videoInfo.src ? (
                          <video
                            src={videoInfo.src}
                            poster={vid.thumbnailUrl || undefined}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : vid.thumbnailUrl ? (
                          <img
                            src={vid.thumbnailUrl}
                            alt={`Thumbnail ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-slate-500">
                            <Film size={22} />
                            <span className="text-[11px]">No video provided</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add More Button (If under 5) */}
            {videos.length < 5 && (
              <button
                type="button"
                onClick={handleAddVideo}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 py-6 text-xs font-bold text-slate-600 hover:border-blue-500 hover:bg-blue-50/40 hover:text-blue-600 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Another Video ({videos.length}/5)</span>
              </button>
            )}

            {/* Bottom Save Bar */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FD8006] px-7 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Saving Carousel...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Carousel Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSectionAdmin;
