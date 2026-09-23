const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const HeroSlider = sequelize.define(
  "HeroSlider",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    buttonText: {
      type: DataTypes.STRING(100),
      defaultValue: "Explore Courses",
    },
    buttonUrl: {
      type: DataTypes.STRING(255),
      defaultValue: "/courses",
    },
    secondaryButtonText: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    secondaryButtonUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    startDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    endDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Draft", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "hero_sliders",
    timestamps: true,
  }
);

module.exports = HeroSlider;
