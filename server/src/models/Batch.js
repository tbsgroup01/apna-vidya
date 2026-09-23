const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Batch = sequelize.define(
  "Batch",
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
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    trainer: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    endTime: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    days: {
      type: DataTypes.STRING(100),
      defaultValue: "Mon, Wed, Fri",
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 40,
    },
    enrolledCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("Upcoming", "Active", "Completed", "Cancelled"),
      defaultValue: "Active",
    },
    meetLink: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "batches",
    timestamps: true,
  }
);

module.exports = Batch;
