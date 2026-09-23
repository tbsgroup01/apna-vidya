const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Syllabus = sequelize.define(
  "Syllabus",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    pdf: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING(30),
      defaultValue: "v1.0",
    },
    fileSize: {
      type: DataTypes.STRING(30),
      defaultValue: "3.2 MB",
    },
    downloadsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("Active", "Archived", "Draft"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "syllabus",
    timestamps: true,
  }
);

module.exports = Syllabus;
