const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    course: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(80),
      defaultValue: "Website",
    },
    status: {
      type: DataTypes.ENUM(
        "New",
        "Contacted",
        "Interested",
        "Follow-up",
        "Converted",
        "Not Interested",
        "Closed"
      ),
      defaultValue: "New",
    },
    assignedTo: {
      type: DataTypes.STRING(100),
      defaultValue: "Unassigned",
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    qualification: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "leads",
    timestamps: true,
  }
);

module.exports = Lead;
