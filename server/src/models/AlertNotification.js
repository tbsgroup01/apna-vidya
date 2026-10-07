const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AlertNotification = sequelize.define(
  "AlertNotification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Offer", "Festival", "Maintenance", "Announcement", "Alert"),
      defaultValue: "Offer",
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
    },
    linkText: {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: "Learn More",
    },
    theme: {
      type: DataTypes.STRING(50),
      defaultValue: "orange",
    },
    bgColor: {
      type: DataTypes.STRING(50),
      defaultValue: "#FD8006",
    },
    textColor: {
      type: DataTypes.STRING(50),
      defaultValue: "#ffffff",
    },
    isMarquee: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    speed: {
      type: DataTypes.STRING(20),
      defaultValue: "normal",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    dismissible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "alert_notifications",
    timestamps: true,
  }
);

module.exports = AlertNotification;
