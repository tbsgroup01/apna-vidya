const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Award = sequelize.define(
  "Award",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    issuer: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING(50),
      defaultValue: "2025",
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verificationUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Archived", "Draft"),
      defaultValue: "Active",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "awards_and_certificates",
    timestamps: true,
  }
);

module.exports = Award;
