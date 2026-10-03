const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Blog = sequelize.define(
  "Blog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: "Technology",
    },
    author: {
      type: DataTypes.STRING(150),
      defaultValue: "ApnaVidya Editorial",
    },
    authorRole: {
      type: DataTypes.STRING(150),
      defaultValue: "Senior Mentor",
    },
    publishedDate: {
      type: DataTypes.STRING(50),
      defaultValue: () => new Date().toISOString().split("T")[0],
    },
    readTime: {
      type: DataTypes.STRING(50),
      defaultValue: "5 min read",
    },
    featuredImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Published", "Draft", "Archived"),
      defaultValue: "Published",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    seoTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    seoDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "blogs",
    timestamps: true,
  }
);

module.exports = Blog;
