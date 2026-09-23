const { Op } = require("sequelize");
const Syllabus = require("../models/Syllabus");
const Course = require("../models/Course");

const getSyllabusList = async (req, res) => {
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
        { version: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (courseId && courseId !== "All") {
      where.courseId = Number(courseId);
    }

    const { count, rows: syllabusList } = await Syllabus.findAndCountAll({
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
        syllabusList,
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
      message: err.message || "Failed to fetch syllabus list",
    });
  }
};

const getSyllabusById = async (req, res) => {
  try {
    const { id } = req.params;
    const syllabus = await Syllabus.findByPk(id, {
      include: [{ model: Course, as: "course" }],
    });

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { syllabus },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch syllabus",
    });
  }
};

const createSyllabus = async (req, res) => {
  try {
    const {
      title,
      courseId,
      version = "v1.0",
      fileSize = "3.2 MB",
      status = "Active",
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Syllabus title is required",
      });
    }

    let pdfPath = req.body.pdf;
    let actualSize = fileSize;

    if (req.file) {
      pdfPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      actualSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const syllabus = await Syllabus.create({
      title,
      courseId: courseId ? Number(courseId) : null,
      pdf: pdfPath || "https://documents.apnavidya.com/syllabus/sample.pdf",
      version,
      fileSize: actualSize,
      status,
    });

    const full = await Syllabus.findByPk(syllabus.id, {
      include: [{ model: Course, as: "course" }],
    });

    return res.status(201).json({
      success: true,
      message: "Syllabus document created successfully",
      data: { syllabus: full },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create syllabus",
    });
  }
};

const updateSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const syllabus = await Syllabus.findByPk(id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    const { title, courseId, pdf, version, fileSize, status } = req.body;

    let pdfPath = pdf !== undefined ? pdf : syllabus.pdf;
    let actualSize = fileSize !== undefined ? fileSize : syllabus.fileSize;

    if (req.file) {
      pdfPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      actualSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    await syllabus.update({
      title: title !== undefined ? title : syllabus.title,
      courseId: courseId !== undefined ? Number(courseId) : syllabus.courseId,
      pdf: pdfPath,
      version: version !== undefined ? version : syllabus.version,
      fileSize: actualSize,
      status: status !== undefined ? status : syllabus.status,
    });

    const updated = await Syllabus.findByPk(syllabus.id, {
      include: [{ model: Course, as: "course" }],
    });

    return res.status(200).json({
      success: true,
      message: "Syllabus document updated successfully",
      data: { syllabus: updated },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update syllabus",
    });
  }
};

const deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const syllabus = await Syllabus.findByPk(id);

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message: "Syllabus not found",
      });
    }

    await syllabus.destroy();
    return res.status(200).json({
      success: true,
      message: "Syllabus document deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete syllabus",
    });
  }
};

module.exports = {
  getSyllabusList,
  getSyllabusById,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
};
