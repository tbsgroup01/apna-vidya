const { Op } = require("sequelize");
const Batch = require("../models/Batch");
const Course = require("../models/Course");
const Student = require("../models/Student");
const StudentBatch = require("../models/StudentBatch");

const getBatches = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      courseId,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { trainer: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (courseId && courseId !== "All") {
      where.courseId = Number(courseId);
    }

    const { count, rows: batches } = await Batch.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "name", "slug", "duration"],
        },
        {
          model: Student,
          as: "batchStudents",
          attributes: ["id", "name", "email"],
          through: { attributes: ["joinedAt"] },
        },
      ],
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        batches,
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
      message: err.message || "Failed to fetch batches",
    });
  }
};

const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id, {
      include: [
        { model: Course, as: "course" },
        {
          model: Student,
          as: "batchStudents",
          through: { attributes: ["joinedAt"] },
        },
      ],
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { batch },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch batch details",
    });
  }
};

const createBatch = async (req, res) => {
  try {
    const {
      name,
      courseId,
      trainer,
      startDate,
      endDate,
      startTime,
      endTime,
      days = "Mon, Wed, Fri",
      capacity = 40,
      status = "Active",
      meetLink,
    } = req.body;

    if (!name || !trainer) {
      return res.status(400).json({
        success: false,
        message: "Batch name and trainer are required",
      });
    }

    const batch = await Batch.create({
      name,
      courseId: courseId ? Number(courseId) : null,
      trainer,
      startDate: startDate || null,
      endDate: endDate || null,
      startTime: startTime || "10:00 AM",
      endTime: endTime || "01:00 PM",
      days,
      capacity: Number(capacity),
      status,
      meetLink: meetLink || null,
    });

    const fullBatch = await Batch.findByPk(batch.id, {
      include: [{ model: Course, as: "course" }],
    });

    return res.status(201).json({
      success: true,
      message: "Batch scheduled successfully",
      data: { batch: fullBatch },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create batch",
    });
  }
};

const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const {
      name,
      courseId,
      trainer,
      startDate,
      endDate,
      startTime,
      endTime,
      days,
      capacity,
      status,
      meetLink,
    } = req.body;

    await batch.update({
      name: name !== undefined ? name : batch.name,
      courseId: courseId !== undefined ? Number(courseId) : batch.courseId,
      trainer: trainer !== undefined ? trainer : batch.trainer,
      startDate: startDate !== undefined ? startDate : batch.startDate,
      endDate: endDate !== undefined ? endDate : batch.endDate,
      startTime: startTime !== undefined ? startTime : batch.startTime,
      endTime: endTime !== undefined ? endTime : batch.endTime,
      days: days !== undefined ? days : batch.days,
      capacity: capacity !== undefined ? Number(capacity) : batch.capacity,
      status: status !== undefined ? status : batch.status,
      meetLink: meetLink !== undefined ? meetLink : batch.meetLink,
    });

    const updated = await Batch.findByPk(batch.id, {
      include: [{ model: Course, as: "course" }],
    });

    return res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: { batch: updated },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update batch",
    });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    await StudentBatch.destroy({ where: { batchId: batch.id } });
    await batch.destroy();

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete batch",
    });
  }
};

module.exports = {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
};
