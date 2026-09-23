const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseModule = sequelize.define(
  "CourseModule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(60),
      defaultValue: "4 Weeks",
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "course_modules",
    timestamps: true,
  }
);

module.exports = CourseModule;
