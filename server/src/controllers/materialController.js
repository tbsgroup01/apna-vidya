const { Op } = require("sequelize");
const CourseMaterial = require("../models/CourseMaterial");
const Course = require("../models/Course");
const CourseModule = require("../models/CourseModule");

const getMaterials = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      courseId,
      status,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (courseId && courseId !== "All") {
      where.courseId = Number(courseId);
    }

    const { count, rows: materials } = await CourseMaterial.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "name"],
        },
      ],
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        materials,
        pagination: {
          total: count,
          page: Number(page),
          pages: Math.ceil(count / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch materials",
    });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await CourseMaterial.findByPk(id, {
      include: [{ model: Course, as: "course" }],
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { material },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch material",
    });
  }
};

const createMaterial = async (req, res) => {
  try {
    const {
      title,
      courseId,
      moduleId,
      description,
      fileType = "PDF Document",
      fileSize = "3.2 MB",
      uploadedBy,
      status = "Published",
      visibility = "Enrolled Students",
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Material title is required",
      });
    }

    let filePath = req.body.file;
    let actualSize = fileSize;

    if (req.file) {
      filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      actualSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const material = await CourseMaterial.create({
      title,
      courseId: courseId ? Number(courseId) : null,
      moduleId: moduleId ? Number(moduleId) : null,
      description,
      file: filePath || "https://documents.apnavidya.com/materials/sample.pdf",
      fileType,
      fileSize: actualSize,
      uploadedBy: uploadedBy || req.user?.name || "Faculty Staff",
      status,
      visibility,
    });

    const full = await CourseMaterial.findByPk(material.id, {
      include: [{ model: Course, as: "course" }],
    });

    return res.status(201).json({
      success: true,
      message: "Material uploaded successfully",
      data: { material: full },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create material",
    });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await CourseMaterial.findByPk(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    const {
      title,
      courseId,
      moduleId,
      description,
      file,
      fileType,
      fileSize,
      status,
      visibility,
    } = req.body;

    let filePath = file !== undefined ? file : material.file;
    let actualSize = fileSize !== undefined ? fileSize : material.fileSize;

    if (req.file) {
      filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      actualSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    await material.update({
      title: title !== undefined ? title : material.title,
      courseId: courseId !== undefined ? Number(courseId) : material.courseId,
      moduleId: moduleId !== undefined ? Number(moduleId) : material.moduleId,
      description: description !== undefined ? description : material.description,
      file: filePath,
      fileType: fileType !== undefined ? fileType : material.fileType,
      fileSize: actualSize,
      status: status !== undefined ? status : material.status,
      visibility: visibility !== undefined ? visibility : material.visibility,
    });

    const updated = await CourseMaterial.findByPk(material.id, {
      include: [{ model: Course, as: "course" }],
    });

    return res.status(200).json({
      success: true,
      message: "Material updated successfully",
      data: { material: updated },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update material",
    });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await CourseMaterial.findByPk(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    await material.destroy();
    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete material",
    });
  }
};

module.exports = {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
