const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const HomeVideoSection = sequelize.define(
  "HomeVideoSection",
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
    badge: {
      type: DataTypes.STRING(255),
      defaultValue: "Why Apna Vidya ?",
    },
    title: {
      type: DataTypes.STRING(255),
      defaultValue: "Discover the Apna Vidya Difference",
    },
    subtitle: {
      type: DataTypes.TEXT,
      defaultValue:
        "Premium Education with Flexible Learning and Expert Guidance. Discover our hands-on projects, industry certifications, and dedicated placement mentoring.",
    },
    videoSourceType: {
      type: DataTypes.STRING(50),
      defaultValue: "url", // "url" or "upload"
    },
    videoUrl: {
      type: DataTypes.TEXT,
      defaultValue: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    buttonText: {
      type: DataTypes.STRING(100),
      defaultValue: "Explore All Courses",
    },
    buttonLink: {
      type: DataTypes.STRING(255),
      defaultValue: "/courses",
    },
    secondaryButtonText: {
      type: DataTypes.STRING(100),
      defaultValue: "Book Free Demo",
    },
    secondaryButtonLink: {
      type: DataTypes.STRING(255),
      defaultValue: "#demo",
    },
    videos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "home_video_sections",
    timestamps: true,
  }
);

module.exports = HomeVideoSection;
