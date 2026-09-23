const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseMaterial = sequelize.define(
  "CourseMaterial",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fileType: {
      type: DataTypes.STRING(50),
      defaultValue: "PDF Document",
    },
    fileSize: {
      type: DataTypes.STRING(30),
      defaultValue: "2.5 MB",
    },
    uploadedBy: {
      type: DataTypes.STRING(100),
      defaultValue: "Faculty Staff",
    },
    downloadsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("Published", "Draft", "Archived"),
      defaultValue: "Published",
    },
    visibility: {
      type: DataTypes.STRING(50),
      defaultValue: "Enrolled Students",
    },
  },
  {
    tableName: "course_materials",
    timestamps: true,
  }
);

module.exports = CourseMaterial;
