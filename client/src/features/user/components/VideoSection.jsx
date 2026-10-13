import React, { useState, useEffect } from "react";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  Film,
  ArrowRight,
  GraduationCap,
  Laptop,
  Users,
  Trophy,
  Award,
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
    title: "Why Learn With APNAVIDYA",
    description: "Know how we help students build real skills and successful careers.",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Full Stack Web Development Overview",
    description: "Get a complete overview of our industry-focused curriculum.",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "1-on-1 Mentorship & Live Sessions",
    description: "See how our mentors guide you with personalized support.",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Student Project & Placement Stories",
    description: "Hear from our students about their learning journey and success stories.",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Verified Global Certifications",
    description: "Discover our globally recognized certifications and career advantages.",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
];

const getVideoCardIcon = (video, idx) => {
  const title = (video.title || "").toLowerCase();
  if (title.includes("why") || title.includes("learn") || title.includes("vidya")) return GraduationCap;
  if (title.includes("web") || title.includes("dev") || title.includes("stack") || title.includes("code")) return Laptop;
  if (title.includes("mentor") || title.includes("session") || title.includes("1-on-1")) return Users;
  if (title.includes("project") || title.includes("placement") || title.includes("story") || title.includes("stories") || title.includes("success")) return Trophy;

  const icons = [GraduationCap, Laptop, Users, Trophy, Award];
  return icons[idx % icons.length];
};

const getVideoDescription = (video, idx) => {
  if (video.description) return video.description;
  const defaultDescriptions = [
    "Know how we help students build real skills and successful careers.",
    "Get a complete overview of our industry-focused curriculum.",
    "See how our mentors guide you with personalized support.",
    "Hear from our students about their learning journey and success stories.",
    "Discover our globally recognized certifications and career advantages.",
  ];
  return defaultDescriptions[idx % defaultDescriptions.length];
};

const VideoSection = () => {
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);
  const [isActive, setIsActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

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

  const touchStartXRef = React.useRef(null);
  const touchStartYRef = React.useRef(null);
  const touchEndXRef = React.useRef(null);
  const touchEndYRef = React.useRef(null);
  const mouseStartXRef = React.useRef(null);
  const mouseEndXRef = React.useRef(null);
  const isMouseDownRef = React.useRef(false);
  const isSwipedRef = React.useRef(false);

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

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(Math.max(0, maxIndex));
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Auto-scroll timer like Testimonials (pauses on hover or when modal is open)
  useEffect(() => {
    if (isPaused || maxIndex <= 0 || activeModalVideo) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex, currentIndex, activeModalVideo]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
    isSwipedRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    touchEndXRef.current = currentX;
    touchEndYRef.current = currentY;

    const diffX = Math.abs(currentX - touchStartXRef.current);
    if (diffX > 10) {
      isSwipedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diffX = touchStartXRef.current - touchEndXRef.current;
      const diffY = Math.abs((touchStartYRef.current || 0) - (touchEndYRef.current || 0));
      const minSwipeDistance = 35;

      // Only swipe if horizontal drag is significantly greater than vertical scroll
      if (Math.abs(diffX) > diffY && Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchEndXRef.current = null;
    touchEndYRef.current = null;

    setTimeout(() => {
      isSwipedRef.current = false;
      setIsPaused(false);
    }, 120);
  };

  // Mouse drag handlers for desktop / testing
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsPaused(true);
    mouseStartXRef.current = e.clientX;
    mouseEndXRef.current = null;
    isMouseDownRef.current = true;
    isSwipedRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || mouseStartXRef.current === null) return;
    mouseEndXRef.current = e.clientX;
    const diffX = Math.abs(e.clientX - mouseStartXRef.current);
    if (diffX > 10) {
      isSwipedRef.current = true;
    }
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current && mouseStartXRef.current !== null && mouseEndXRef.current !== null) {
      const diffX = mouseStartXRef.current - mouseEndXRef.current;
      const minSwipeDistance = 35;

      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }

    isMouseDownRef.current = false;
    mouseStartXRef.current = null;
    mouseEndXRef.current = null;

    setTimeout(() => {
      isSwipedRef.current = false;
      setIsPaused(false);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (isMouseDownRef.current) {
      handleMouseUp();
    }
  };

  const openVideoModal = (video) => {
    if (isSwipedRef.current) return;
    setActiveModalVideo(video);
  };

  if (!isActive || !videos || videos.length === 0) {
    return null;
  }

  const translatePercent = currentIndex * (100 / itemsPerView);

  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background waves matching overall theme */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Top-Left Peach Flowing Curve */}
        <div className="absolute -top-12 -left-12 h-80 w-80 rounded-full bg-gradient-to-br from-orange-300/35 via-amber-200/15 to-transparent blur-3xl" />
        {/* Bottom-Left Soft Blue Curve */}
        <div className="absolute -bottom-16 -left-16 h-88 w-88 rounded-full bg-gradient-to-tr from-sky-300/30 via-blue-200/15 to-transparent blur-3xl" />
        {/* Bottom-Right Soft Blue & Peach Curve */}
        <div className="absolute -bottom-16 -right-16 h-88 w-88 rounded-full bg-gradient-to-tl from-blue-400/30 via-sky-300/15 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="relative mb-12 flex flex-col items-center justify-center text-center">

          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-bold text-blue-600">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FD8006] text-white">
              <Play size={8} className="fill-white ml-0.5" />
            </div>
            <span>EXPLORE APNAVIDYA</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-[40px]">
            Why <span className="text-blue-600">APNA</span>
            <span className="text-[#FD8006]">VIDYA</span> ?
          </h2>

          {/* Subtitle */}
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base font-normal">
            Discover the APNAVIDYA Difference - Premium Education with Flexible
            Learning and Expert Guidance.
          </p>

          {/* Carousel Arrows on Top-Right (Desktop) */}
          {videos.length > itemsPerView && (
            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-2xs hover:bg-blue-50 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                aria-label="Previous videos"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-white text-[#FD8006] shadow-2xs hover:bg-orange-50 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                aria-label="Next videos"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container with Touch & Mouse Swipe */}
        <div
          className="overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="flex transition-transform duration-500 ease-out py-2"
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

              const Icon = getVideoCardIcon(vid, idx);
              const description = getVideoDescription(vid, idx);
              const isOrangeIcon = idx % 2 === 0;
              const displayTitle = (vid.title || `APNAVIDYA Video ${idx + 1}`).replace(/ApnaVidya|Apna Vidya/gi, "APNAVIDYA");

              return (
                <div
                  key={vid.id || idx}
                  className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-3"
                >
                  <div
                    onClick={() => openVideoModal(vid)}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full select-none"
                  >
                    {/* Top Thumbnail Section (16:9) with Corner Wave Accents */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={thumbnail}
                        alt={displayTitle}
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80";
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
                      />

                      {/* Soft Corner Wave Overlays on Thumbnail */}
                      <div className="pointer-events-none absolute -bottom-3 -left-3 h-14 w-20 rounded-full bg-gradient-to-tr from-blue-500/70 to-transparent blur-md" />
                      <div className="pointer-events-none absolute -top-3 -right-3 h-14 w-20 rounded-full bg-gradient-to-bl from-orange-500/70 to-transparent blur-md" />

                      {/* Index Tag on Top-Left */}
                      <div className="absolute top-3 left-3 rounded-lg bg-slate-950/75 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                        {idx + 1} of {videos.length}
                      </div>

                      {/* Center Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex h-13 w-13 items-center justify-center rounded-full bg-[#FD8006] text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FD8006]">
                          <span className="absolute -inset-1 rounded-full border border-white/50 animate-ping opacity-60" />
                          <Play size={20} className="ml-0.5 fill-white text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        {/* Icon and Title Row */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isOrangeIcon
                              ? "bg-orange-50 text-[#FD8006]"
                              : "bg-blue-50 text-blue-600"
                              } shadow-2xs`}
                          >
                            <Icon size={20} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                              {displayTitle}
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-2.5 text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
                          {description}
                        </p>
                      </div>

                      {/* Watch Now Button */}
                      <div className="mt-4 pt-1">
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50/80 group-hover:bg-blue-100/90 text-blue-600 font-bold text-xs py-2.5 transition-colors">
                          <Play size={12} className="fill-blue-600 text-blue-600" />
                          <span>Watch Now</span>
                          <ArrowRight
                            size={13}
                            strokeWidth={2.5}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots & Mobile Navigation Controls */}
        {videos.length > itemsPerView && (
          <div className="mt-8 flex items-center justify-center gap-3">
            {/* Mobile Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous video"
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === dotIdx
                    ? "w-7 bg-[#FD8006]"
                    : "w-2 bg-blue-100 hover:bg-blue-200"
                    }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            {/* Mobile Next Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next video"
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-xl border border-orange-100 bg-white text-[#FD8006] shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
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
                  {activeModalVideo.title || "APNAVIDYA Video Player"}
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