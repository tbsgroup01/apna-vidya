import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  Film,
  Sparkles,
} from "lucide-react";
import api from "../../../services/api";

const parseVideoUrl = (url = "") => {
  if (!url || typeof url !== "string") {
    return { type: "empty", src: "", defaultThumbnail: "" };
  }

  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
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
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`,
      videoId: vimeoMatch[1],
      defaultThumbnail: "",
    };
  }

  // Direct video file (.mp4, /uploads/...)
  return {
    type: "video",
    src: trimmed,
    defaultThumbnail: "",
  };
};

const DEFAULT_VIDEOS = [
  {
    id: 1,
    title: "Why Learn With Apna Vidya",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "1-on-1 Mentorship & Sessions",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Student Project & Placements",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Verified Global Certifications",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
];

const VideoSection = () => {
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);
  const [isActive, setIsActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModalVideo, setActiveModalVideo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        const res = await api.get("/public/video-section");
        const incoming = res.data?.data?.videoSection;
        if (isMounted && incoming) {
          setIsActive(
            typeof incoming.isActive === "boolean" ? incoming.isActive : true
          );
          if (Array.isArray(incoming.videos) && incoming.videos.length > 0) {
            setVideos(incoming.videos.slice(0, 5));
          }
        }
      } catch {
        // Fall back gracefully to DEFAULT_VIDEOS
      }
    };

    fetchVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close modal with ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveModalVideo(null);
      }
    };
    if (activeModalVideo) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeModalVideo]);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerView = windowWidth >= 1024 ? 4 : windowWidth >= 640 ? 2 : 1;
  const maxIndex = Math.max(0, videos.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const openVideoModal = (video) => {
    setActiveModalVideo(video);
  };

  if (!isActive || !videos || videos.length === 0) {
    return null;
  }

  const translatePercent = currentIndex * (100 / itemsPerView);

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-20 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Fixed clean title without clutter */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles size={13} className="text-blue-600" />
              <span>Explore Apna Vidya</span>
            </div>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Why Apna Vidya ?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Discover the Apna Vidya Difference - Premium Education with Flexible
              Learning and Expert Guidance.
            </p>
          </div>

          {/* Carousel Arrows (Active if videos > itemsPerView) */}
          {videos.length > itemsPerView && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Previous videos"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Next videos"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="mt-8 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${translatePercent}%)`,
            }}
          >
            {videos.map((vid, idx) => {
              const meta = parseVideoUrl(vid.videoUrl);
              const thumbnail =
                vid.thumbnailUrl ||
                meta.defaultThumbnail ||
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80";

              return (
                <div
                  key={vid.id || idx}
                  className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2.5"
                >
                  <div
                    onClick={() => openVideoModal(vid)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300"
                  >
                    {/* Video Card Thumbnail (16:9) */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <img
                        src={thumbnail}
                        alt={vid.title || `Video ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80";
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent transition-opacity group-hover:opacity-75" />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex h-13 w-13 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-lg backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600">
                          <span className="absolute -inset-1 rounded-full border border-white/40 animate-ping opacity-60" />
                          <Play size={20} className="ml-0.5 fill-white text-white" />
                        </div>
                      </div>

                      {/* Index Tag */}
                      <div className="absolute top-2.5 left-2.5 rounded-md bg-slate-950/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                        {idx + 1} of {videos.length}
                      </div>
                    </div>

                    {/* Card Title Bar */}
                    <div className="bg-white p-3.5 border-t border-slate-100">
                      <h3 className="truncate text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {vid.title || `Apna Vidya Video ${idx + 1}`}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Play size={11} className="text-blue-500 fill-blue-500" />
                        <span>Click to watch video</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {videos.length > itemsPerView && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === dotIdx
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* HD Cinema Lightbox Modal Player */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setActiveModalVideo(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 truncate max-w-md">
                  {activeModalVideo.title || "Apna Vidya Video Player"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black">
              {(() => {
                const meta = parseVideoUrl(activeModalVideo.videoUrl);
                if (meta.type === "youtube" || meta.type === "vimeo") {
                  return (
                    <iframe
                      src={meta.src}
                      title={activeModalVideo.title || "Video Player"}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                } else if (meta.type === "video" && meta.src) {
                  return (
                    <video
                      src={meta.src}
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    >
                      Your browser does not support HTML5 video streaming.
                    </video>
                  );
                }
                return (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
                    <Film size={32} />
                    <p className="text-xs">No video source available</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;