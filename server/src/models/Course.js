const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(50),
      defaultValue: "6 Months",
    },
    level: {
      type: DataTypes.STRING(50),
      defaultValue: "Beginner to Advanced",
    },
    fees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Draft", "Archived"),
      defaultValue: "Active",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    learningOutcomes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    prerequisites: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    certificateInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    classFormat: {
      type: DataTypes.STRING(100),
      defaultValue: "100% Live Online",
    },
    batchTiming: {
      type: DataTypes.STRING(100),
      defaultValue: "Weekday / Weekend",
    },
    lmsAccess: {
      type: DataTypes.STRING(100),
      defaultValue: "Lifetime Validity",
    },
    doubtResolution: {
      type: DataTypes.STRING(100),
      defaultValue: "Daily Live Windows",
    },
    targetAudience: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    faqs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    fullOverview: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    syllabusUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

module.exports = Course;
