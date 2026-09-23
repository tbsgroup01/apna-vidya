const AboutContent = require("../models/AboutContent");

const DEFAULT_VALUES = [
  {
    icon: "Target",
    title: "Outcome Driven",
    desc: "We focus on what truly matters in the industry: shipping production code, building real portfolios, and cracking job interviews.",
  },
  {
    icon: "Heart",
    title: "Student-First Mentorship",
    desc: "Every student learns at their own pace. Our dedicated 1-on-1 doubt sessions ensure nobody gets left behind.",
  },
  {
    icon: "ShieldCheck",
    title: "Uncompromising Quality",
    desc: "Our curriculum is reviewed by senior engineers at top product companies to guarantee modern relevance.",
  },
  {
    icon: "Award",
    title: "Verifiable Excellence",
    desc: "Every credential earned through Apna Vidya is backed by ISO 9001:2015 standards and independent digital verification.",
  },
];

const DEFAULT_TEAM = [
  {
    name: "Dr. Sandeep Nair",
    role: "Founder & Academic Director",
    credentials: "Ex-Professor IIT, 18+ Years Experience",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Amit Verma",
    role: "Head of Engineering & Full Stack Lead",
    credentials: "Ex-Senior Staff Engineer, Tech Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Pooja Sharma",
    role: "Head of Career & Corporate Placements",
    credentials: "12+ Years Corporate HR & Talent Acquisition",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rajesh Mehrotra",
    role: "Lead Mobile & Systems Architect",
    credentials: "Built applications with 10M+ Play Store downloads",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
];

const DEFAULT_ABOUT = {
  key: "main",
  heroBadge: "About Apna Vidya",
  heroTitle: "Empowering the Next Generation of India's Builders",
  heroDescription:
    "Apna Vidya is an edtech platform committed to making high-impact, practical computer science and academic education accessible to every student in India.",
  storyTag: "Our Story",
  storyTitle: "Bridging the Gap Between College Degrees and Industry Careers",
  storyParagraph1:
    "Over 1.5 million engineering and computer science students graduate in India every year, yet less than 15% possess the skills required to build modern software applications.",
  storyParagraph2:
    "Apna Vidya was founded to address this exact reality. We discarded passive rote learning in favor of high-engagement live workshops, real product development, and continuous 1-on-1 code reviews.",
  stat1Value: "50,000+",
  stat1Label: "Graduated Students",
  stat2Value: "120+",
  stat2Label: "Hiring Company Partners",
  missionTitle: "Our Mission",
  missionDescription:
    "To provide affordable, high-quality, practical mentorship and verifiable skill development to learners across tier 1, 2, and 3 cities across India.",
  visionTitle: "Our Vision",
  visionDescription:
    "To become India's most student-centric learning community where anybody with grit and curiosity can transition into a thriving software engineering career.",
  valuesTag: "Our Pillars",
  valuesTitle: "Values That Drive Everything We Do",
  values: DEFAULT_VALUES,
  teamTag: "Experienced Educators",
  teamTitle: "Meet the Mentors Behind Apna Vidya",
  teamSubtitle:
    "Learn from engineers who have shipped software at scale and trained thousands of successful graduates.",
  team: DEFAULT_TEAM,
  ctaTitle: "Experience the Apna Vidya Way of Learning",
  ctaDescription:
    "Join a live session, speak with our instructors, and explore how our curriculum can help you achieve your career aspirations.",
  ctaPrimaryText: "Book a Free Demo Class",
  ctaSecondaryText: "Explore All Courses",
  ctaSecondaryLink: "/courses",
};

const formatAbout = (record) => {
  const data = record.toJSON ? record.toJSON() : { ...record };
  if (typeof data.values === "string") {
    try {
      data.values = JSON.parse(data.values);
    } catch {
      data.values = DEFAULT_VALUES;
    }
  }
  if (!Array.isArray(data.values)) {
    data.values = DEFAULT_VALUES;
  }

  if (typeof data.team === "string") {
    try {
      data.team = JSON.parse(data.team);
    } catch {
      data.team = DEFAULT_TEAM;
    }
  }
  if (!Array.isArray(data.team)) {
    data.team = DEFAULT_TEAM;
  }

  return data;
};

const getAboutContent = async (req, res) => {
  try {
    let [about] = await AboutContent.findOrCreate({
      where: { key: "main" },
      defaults: DEFAULT_ABOUT,
    });

    return res.status(200).json({
      success: true,
      data: { about: formatAbout(about) },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch about content",
    });
  }
};

const updateAboutContent = async (req, res) => {
  try {
    let [about] = await AboutContent.findOrCreate({
      where: { key: "main" },
      defaults: DEFAULT_ABOUT,
    });

    const allowedFields = [
      "heroBadge",
      "heroTitle",
      "heroDescription",
      "storyTag",
      "storyTitle",
      "storyParagraph1",
      "storyParagraph2",
      "stat1Value",
      "stat1Label",
      "stat2Value",
      "stat2Label",
      "missionTitle",
      "missionDescription",
      "visionTitle",
      "visionDescription",
      "valuesTag",
      "valuesTitle",
      "values",
      "teamTag",
      "teamTitle",
      "teamSubtitle",
      "team",
      "ctaTitle",
      "ctaDescription",
      "ctaPrimaryText",
      "ctaSecondaryText",
      "ctaSecondaryLink",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    await about.update(updates);

    return res.status(200).json({
      success: true,
      message: "About Us content updated successfully",
      data: { about: formatAbout(about) },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update about content",
    });
  }
};

const getPublicAboutContent = async (req, res) => {
  try {
    let [about] = await AboutContent.findOrCreate({
      where: { key: "main" },
      defaults: DEFAULT_ABOUT,
    });

    return res.status(200).json({
      success: true,
      data: { about: formatAbout(about) },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch public about content",
    });
  }
};

module.exports = {
  getAboutContent,
  updateAboutContent,
  getPublicAboutContent,
  DEFAULT_ABOUT,
};
