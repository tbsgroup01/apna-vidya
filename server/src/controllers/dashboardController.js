const { Op } = require("sequelize");
const Student = require("../models/Student");
const Lead = require("../models/Lead");
const Course = require("../models/Course");
const Batch = require("../models/Batch");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      activeCourses,
      activeBatches,
      totalLeads,
      convertedLeads,
      revenueResult,
      pendingResult,
      recentLeads,
      recentStudents,
      coursesWithStudents,
    ] = await Promise.all([
      Student.count(),
      Course.count({ where: { status: "Active" } }),
      Batch.count({ where: { status: "Active" } }),
      Lead.count(),
      Lead.count({ where: { status: "Converted" } }),
      Student.sum("paidFees"),
      Student.sum("pendingFees"),
      Lead.findAll({
        limit: 5,
        order: [["createdAt", "DESC"]],
      }),
      Student.findAll({
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [{ model: Course, as: "enrolledCourses", attributes: ["id", "name"] }],
      }),
      Course.findAll({
        attributes: ["id", "name", "fees"],
        include: [
          {
            model: Student,
            as: "enrolledStudents",
            attributes: ["id"],
            through: { attributes: [] },
          },
        ],
        limit: 6,
      }),
    ]);

    const totalRevenue = revenueResult || 0;
    const totalPending = pendingResult || 0;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    const coursePopularity = coursesWithStudents.map((c) => ({
      id: c.id,
      name: c.name,
      studentsCount: c.enrolledStudents ? c.enrolledStudents.length : 0,
      fees: c.fees,
    }));

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          activeCourses,
          activeBatches,
          totalLeads,
          convertedLeads,
          conversionRate,
          totalRevenue,
          totalPending,
        },
        recentLeads,
        recentStudents,
        coursePopularity,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};
