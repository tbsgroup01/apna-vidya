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
      allLeads,
      allCourses,
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
      Lead.findAll({
        attributes: ["id", "course", "source"],
      }),
      Course.findAll({
        attributes: ["id", "name", "fees"],
        where: { status: "Active" },
      }),
    ]);

    const totalRevenue = revenueResult || 0;
    const totalPending = pendingResult || 0;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    // Filter leads for demo class requests (matching /admin/demo-classes criteria)
    const demoLeads = (allLeads || []).filter((l) => {
      const source = (l.source || "").toLowerCase();
      return source.includes("demo");
    });

    // Aggregate demo request counts per course
    const courseDemoCounts = {};
    demoLeads.forEach((lead) => {
      const courseName = (lead.course || "").trim();
      if (courseName) {
        courseDemoCounts[courseName] = (courseDemoCounts[courseName] || 0) + 1;
      }
    });

    // Collate courses with their demo counts
    const demandingMap = new Map();
    Object.entries(courseDemoCounts).forEach(([name, count]) => {
      demandingMap.set(name.toLowerCase(), {
        name,
        count,
      });
    });

    // Add active courses if not yet in map
    (allCourses || []).forEach((c) => {
      const key = (c.name || "").trim().toLowerCase();
      if (key && !demandingMap.has(key)) {
        demandingMap.set(key, {
          name: c.name,
          count: 0,
        });
      }
    });

    // Filter courses with actual demo requests and sort descending
    const sortedDemanding = Array.from(demandingMap.values())
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    // Exactly top 2 courses at a time ("ed time pe 2 course dikhe")
    const top2Demanding = sortedDemanding.slice(0, 2);

    // Dynamic percentage relative to top course with no fixed ceiling ("max kuch nhi hoga")
    const topCount = top2Demanding[0]?.count || 0;
    const mostDemandingPrograms = top2Demanding.map((item) => ({
      course: item.name,
      count: item.count,
      unit: item.count === 1 ? "demo request" : "demo requests",
      percentage: topCount > 0 ? Math.round((item.count / topCount) * 100) : 0,
    }));

    // Calculate live lead conversion breakdown
    const statusCounts = {};
    (allLeads || []).forEach((l) => {
      const st = l.status || "New";
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    const leadConversion = [
      { label: "Converted", value: statusCounts["Converted"] || 0, color: "#10b981" },
      { label: "Follow-up", value: (statusCounts["Contacted"] || 0) + (statusCounts["In Progress"] || 0), color: "#3b82f6" },
      { label: "Demo Scheduled", value: statusCounts["Demo Scheduled"] || 0, color: "#8b5cf6" },
      { label: "New Leads", value: statusCounts["New"] || 0, color: "#f59e0b" },
      { label: "Lost / Closed", value: statusCounts["Lost"] || 0, color: "#f43f5e" },
    ].filter((item) => item.value > 0);

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
        coursePopularity: mostDemandingPrograms,
        mostDemandingPrograms,
        leadConversion,
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
