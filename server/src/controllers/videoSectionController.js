const HomeVideoSection = require("../models/HomeVideoSection");

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
  {
    id: 5,
    title: "Industry Certification Verification",
    videoSourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
];

const DEFAULT_VIDEO_SECTION = {
  key: "main",
  badge: "Why Apna Vidya ?",
  title: "Why Apna Vidya ?",
  subtitle:
    "Discover the Apna Vidya Difference - Premium Education with Flexible Learning and Expert Guidance.",
  videos: DEFAULT_VIDEOS,
  isActive: true,
};

const formatVideoSection = (record) => {
  if (!record) return DEFAULT_VIDEO_SECTION;
  const raw = typeof record.toJSON === "function" ? record.toJSON() : record;

  let videos = raw.videos;
  if (typeof videos === "string") {
    try {
      videos = JSON.parse(videos);
    } catch {
      videos = DEFAULT_VIDEOS;
    }
  }

  if (!Array.isArray(videos) || videos.length === 0) {
    videos = DEFAULT_VIDEOS;
  }

  // Ensure up to 5 videos only
  videos = videos.slice(0, 5);

  return {
    id: raw.id,
    key: raw.key || "main",
    badge: "Why Apna Vidya ?",
    title: "Why Apna Vidya ?",
    subtitle:
      "Discover the Apna Vidya Difference - Premium Education with Flexible Learning and Expert Guidance.",
    videos,
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
    updatedAt: raw.updatedAt,
  };
};

const getVideoSection = async (req, res) => {
  try {
    let [record] = await HomeVideoSection.findOrCreate({
      where: { key: "main" },
      defaults: DEFAULT_VIDEO_SECTION,
    });

    return res.status(200).json({
      success: true,
      data: {
        videoSection: formatVideoSection(record),
      },
    });
  } catch (error) {
    console.error("Error fetching video section (admin):", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load video section configuration",
      data: {
        videoSection: DEFAULT_VIDEO_SECTION,
      },
    });
  }
};

const getPublicVideoSection = async (req, res) => {
  try {
    const record = await HomeVideoSection.findOne({
      where: { key: "main" },
    });

    const formatted = formatVideoSection(record || DEFAULT_VIDEO_SECTION);

    return res.status(200).json({
      success: true,
      data: {
        videoSection: formatted,
      },
    });
  } catch (error) {
    console.error("Error fetching public video section:", error);
    return res.status(200).json({
      success: true,
      data: {
        videoSection: DEFAULT_VIDEO_SECTION,
      },
    });
  }
};

const updateVideoSection = async (req, res) => {
  try {
    const [record] = await HomeVideoSection.findOrCreate({
      where: { key: "main" },
      defaults: DEFAULT_VIDEO_SECTION,
    });

    const { videos, isActive } = req.body;

    let parsedVideos = videos;
    if (typeof videos === "string") {
      try {
        parsedVideos = JSON.parse(videos);
      } catch {
        parsedVideos = record.videos || DEFAULT_VIDEOS;
      }
    }

    if (Array.isArray(parsedVideos)) {
      // Limit to 5 videos
      parsedVideos = parsedVideos.slice(0, 5);
    }

    await record.update({
      videos: parsedVideos !== undefined ? parsedVideos : record.videos,
      isActive: typeof isActive === "boolean" ? isActive : record.isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Home video carousel updated successfully",
      data: {
        videoSection: formatVideoSection(record),
      },
    });
  } catch (error) {
    console.error("Error updating video section:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update home video section",
    });
  }
};

const uploadVideo = async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided for upload",
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      url: fileUrl,
      data: {
        url: fileUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process video upload",
    });
  }
};

module.exports = {
  DEFAULT_VIDEO_SECTION,
  DEFAULT_VIDEOS,
  getVideoSection,
  getPublicVideoSection,
  updateVideoSection,
  uploadVideo,
};
