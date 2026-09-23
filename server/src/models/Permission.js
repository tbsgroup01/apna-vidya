const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "permissions",
    timestamps: true,
  }
);

module.exports = Permission;
