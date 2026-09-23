const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PlatformSetting = sequelize.define(
  "PlatformSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      defaultValue: "platform_settings",
    },
    general: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    seo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    customTags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    contact: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    email: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "platform_settings",
    timestamps: true,
  }
);

module.exports = PlatformSetting;
