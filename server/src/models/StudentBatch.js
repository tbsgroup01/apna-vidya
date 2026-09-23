const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const StudentBatch = sequelize.define(
  "StudentBatch",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    joinedAt: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "student_batches",
    timestamps: true,
  }
);

module.exports = StudentBatch;
