const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseLesson = sequelize.define(
  "CourseLesson",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(60),
      defaultValue: "45 mins",
    },
    type: {
      type: DataTypes.ENUM("Video", "Live Class", "Reading", "Quiz", "Assignment"),
      defaultValue: "Video",
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "course_lessons",
    timestamps: true,
  }
);

module.exports = CourseLesson;
