const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const StudentCourse = sequelize.define(
  "StudentCourse",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Enrolled", "Completed", "Dropped"),
      defaultValue: "Enrolled",
    },
    enrolledAt: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "student_courses",
    timestamps: true,
  }
);

module.exports = StudentCourse;
