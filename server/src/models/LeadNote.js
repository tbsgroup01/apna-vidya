const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LeadNote = sequelize.define(
  "LeadNote",
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
    author: {
      type: DataTypes.STRING(100),
      defaultValue: "Staff",
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "lead_notes",
    timestamps: true,
  }
);

module.exports = LeadNote;
