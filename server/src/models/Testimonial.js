const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Testimonial = sequelize.define(
  "Testimonial",
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
    role: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    course: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "testimonials",
    timestamps: true,
  }
);

module.exports = Testimonial;
