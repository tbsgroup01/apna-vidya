const { Op } = require("sequelize");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Batch = require("../models/Batch");
const StudentCourse = require("../models/StudentCourse");
const StudentBatch = require("../models/StudentBatch");

const getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { registrationNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== "All") {
      where.status = status;
    }

    const { count, rows: students } = await Student.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: Course,
          as: "enrolledCourses",
          attributes: ["id", "name", "duration", "fees"],
          through: { attributes: ["status", "enrolledAt"] },
        },
        {
          model: Batch,
          as: "enrolledBatches",
          attributes: ["id", "name", "trainer", "days", "status"],
          through: { attributes: ["joinedAt"] },
        },
      ],
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        students,
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
      message: err.message || "Failed to fetch students",
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Course,
          as: "enrolledCourses",
          through: { attributes: ["status", "enrolledAt"] },
        },
        {
          model: Batch,
          as: "enrolledBatches",
          through: { attributes: ["joinedAt"] },
        },
      ],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { student },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch student profile",
    });
  }
};

const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dob,
      gender = "Male",
      address,
      profileImage,
      admissionDate = new Date().toISOString().split("T")[0],
      status = "Active",
      totalFees = 0,
      paidFees = 0,
      notes,
      courseId,
      batchId,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone number are required",
      });
    }

    const existing = await Student.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A student with this email address already exists",
      });
    }

    const pendingFees = Math.max(0, Number(totalFees) - Number(paidFees));
    const paymentStatus =
      pendingFees === 0
        ? "Paid"
        : Number(paidFees) > 0
        ? "Partial"
        : "Pending";

    const student = await Student.create({
      name,
      email,
      phone,
      dob: dob || null,
      gender,
      address,
      profileImage:
        profileImage ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      admissionDate,
      status,
      totalFees: Number(totalFees),
      paidFees: Number(paidFees),
      pendingFees,
      paymentStatus,
      notes,
    });

    if (courseId) {
      await StudentCourse.findOrCreate({
        where: { studentId: student.id, courseId: Number(courseId) },
        defaults: {
          studentId: student.id,
          courseId: Number(courseId),
          status: "Enrolled",
          enrolledAt: admissionDate,
        },
      });
    }

    if (batchId) {
      const batch = await Batch.findByPk(batchId);
      if (batch) {
        await StudentBatch.findOrCreate({
          where: { studentId: student.id, batchId: Number(batchId) },
          defaults: {
            studentId: student.id,
            batchId: Number(batchId),
            joinedAt: admissionDate,
          },
        });
        await batch.increment("enrolledCount");
      }
    }

    const fullStudent = await Student.findByPk(student.id, {
      include: [
        { model: Course, as: "enrolledCourses" },
        { model: Batch, as: "enrolledBatches" },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Student enrolled successfully",
      data: { student: fullStudent },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create student",
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const {
      name,
      email,
      phone,
      dob,
      gender,
      address,
      profileImage,
      admissionDate,
      status,
      totalFees,
      paidFees,
      attendance,
      notes,
      courseId,
      batchId,
    } = req.body;

    const newTotal = totalFees !== undefined ? Number(totalFees) : student.totalFees;
    const newPaid = paidFees !== undefined ? Number(paidFees) : student.paidFees;
    const pendingFees = Math.max(0, newTotal - newPaid);
    const paymentStatus =
      pendingFees === 0
        ? "Paid"
        : newPaid > 0
        ? "Partial"
        : "Pending";

    await student.update({
      name: name !== undefined ? name : student.name,
      email: email !== undefined ? email : student.email,
      phone: phone !== undefined ? phone : student.phone,
      dob: dob !== undefined ? dob : student.dob,
      gender: gender !== undefined ? gender : student.gender,
      address: address !== undefined ? address : student.address,
      profileImage:
        profileImage !== undefined ? profileImage : student.profileImage,
      admissionDate:
        admissionDate !== undefined ? admissionDate : student.admissionDate,
      status: status !== undefined ? status : student.status,
      totalFees: newTotal,
      paidFees: newPaid,
      pendingFees,
      paymentStatus,
      attendance:
        attendance !== undefined ? Number(attendance) : student.attendance,
      notes: notes !== undefined ? notes : student.notes,
    });

    if (courseId) {
      await StudentCourse.findOrCreate({
        where: { studentId: student.id, courseId: Number(courseId) },
        defaults: {
          studentId: student.id,
          courseId: Number(courseId),
          status: "Enrolled",
        },
      });
    }

    if (batchId) {
      const batch = await Batch.findByPk(batchId);
      if (batch) {
        const [sb, created] = await StudentBatch.findOrCreate({
          where: { studentId: student.id, batchId: Number(batchId) },
          defaults: {
            studentId: student.id,
            batchId: Number(batchId),
          },
        });
        if (created) {
          await batch.increment("enrolledCount");
        }
      }
    }

    const updatedStudent = await Student.findByPk(student.id, {
      include: [
        { model: Course, as: "enrolledCourses" },
        { model: Batch, as: "enrolledBatches" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: { student: updatedStudent },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update student",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await StudentCourse.destroy({ where: { studentId: student.id } });
    await StudentBatch.destroy({ where: { studentId: student.id } });
    await student.destroy();

    return res.status(200).json({
      success: true,
      message: "Student removed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete student",
    });
  }
};

const bulkDeleteStudents = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of student IDs is required for bulk deletion",
      });
    }
    await StudentCourse.destroy({ where: { studentId: ids } });
    await StudentBatch.destroy({ where: { studentId: ids } });
    const count = await Student.destroy({ where: { id: ids } });
    return res.status(200).json({
      success: true,
      message: `${count} student(s) deleted successfully`,
      data: { count, deletedIds: ids },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to bulk delete students",
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkDeleteStudents,
};
