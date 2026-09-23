const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LeadActivity = sequelize.define(
  "LeadActivity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "lead_activities",
    timestamps: true,
  }
);

module.exports = LeadActivity;
