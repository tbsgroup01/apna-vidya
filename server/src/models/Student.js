const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Student = sequelize.define(
  "Student",
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
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      defaultValue: "Male",
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    admissionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Completed", "Dropped", "Inactive"),
      defaultValue: "Active",
    },
    totalFees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    paidFees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pendingFees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    paymentStatus: {
      type: DataTypes.ENUM("Paid", "Partial", "Pending"),
      defaultValue: "Pending",
    },
    attendance: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

module.exports = Student;
