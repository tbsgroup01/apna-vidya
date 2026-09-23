const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AboutContent = sequelize.define(
  "AboutContent",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      defaultValue: "main",
    },
    heroBadge: {
      type: DataTypes.STRING(255),
      defaultValue: "About Apna Vidya",
    },
    heroTitle: {
      type: DataTypes.STRING(255),
      defaultValue: "Empowering the Next Generation of India's Builders",
    },
    heroDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    storyTag: {
      type: DataTypes.STRING(100),
      defaultValue: "Our Story",
    },
    storyTitle: {
      type: DataTypes.STRING(255),
      defaultValue: "Bridging the Gap Between College Degrees and Industry Careers",
    },
    storyParagraph1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    storyParagraph2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stat1Value: {
      type: DataTypes.STRING(50),
      defaultValue: "50,000+",
    },
    stat1Label: {
      type: DataTypes.STRING(100),
      defaultValue: "Graduated Students",
    },
    stat2Value: {
      type: DataTypes.STRING(50),
      defaultValue: "120+",
    },
    stat2Label: {
      type: DataTypes.STRING(100),
      defaultValue: "Hiring Company Partners",
    },
    missionTitle: {
      type: DataTypes.STRING(100),
      defaultValue: "Our Mission",
    },
    missionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visionTitle: {
      type: DataTypes.STRING(100),
      defaultValue: "Our Vision",
    },
    visionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valuesTag: {
      type: DataTypes.STRING(100),
      defaultValue: "Our Pillars",
    },
    valuesTitle: {
      type: DataTypes.STRING(255),
      defaultValue: "Values That Drive Everything We Do",
    },
    values: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    teamTag: {
      type: DataTypes.STRING(100),
      defaultValue: "Experienced Educators",
    },
    teamTitle: {
      type: DataTypes.STRING(255),
      defaultValue: "Meet the Mentors Behind Apna Vidya",
    },
    teamSubtitle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    team: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    ctaTitle: {
      type: DataTypes.STRING(255),
      defaultValue: "Experience the Apna Vidya Way of Learning",
    },
    ctaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ctaPrimaryText: {
      type: DataTypes.STRING(100),
      defaultValue: "Book a Free Demo Class",
    },
    ctaSecondaryText: {
      type: DataTypes.STRING(100),
      defaultValue: "Explore All Courses",
    },
    ctaSecondaryLink: {
      type: DataTypes.STRING(255),
      defaultValue: "/courses",
    },
  },
  {
    tableName: "about_contents",
    timestamps: true,
  }
);

module.exports = AboutContent;
