const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const HolidayEmail = sequelize.define(
  "HolidayEmail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    holidayName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    recipients: {
      type: DataTypes.STRING(100),
      defaultValue: "All Active Students",
    },
    recipientCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    failedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Draft", "Scheduled", "Sending", "Sent", "Failed"),
      defaultValue: "Draft",
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryLogs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "holiday_emails",
    timestamps: true,
  }
);

module.exports = HolidayEmail;
