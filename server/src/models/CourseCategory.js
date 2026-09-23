const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseCategory = sequelize.define(
  "CourseCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(100),
      defaultValue: "BookOpen",
    },
  },
  {
    tableName: "course_categories",
    timestamps: true,
  }
);

module.exports = CourseCategory;
