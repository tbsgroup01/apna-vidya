const { Op } = require("sequelize");
const AlertNotification = require("../models/AlertNotification");

const DEFAULT_ALERTS = [
  {
    title: "🎉 Festive Mega Offer 2026",
    message:
      "🪔 Festive Special: Get Flat 30% OFF on all Tech & Programming Certification Programs! Use Code: FESTIVE30 • Limited Seats Available! Enroll Today!",
    category: "Offer",
    link: "/courses",
    linkText: "Claim 30% OFF",
    theme: "orange",
    isMarquee: true,
    speed: "normal",
    status: "Active",
    displayOrder: 1,
    dismissible: true,
  },
  {
    title: "⚠️ Scheduled Server Maintenance",
    message:
      "🛠️ ApnaVidya portal will undergo brief scheduled maintenance this Sunday from 12:00 AM to 2:00 AM IST. All live dashboards & lab sessions will resume normally.",
    category: "Maintenance",
    link: "",
    linkText: "Status Details",
    theme: "warning",
    isMarquee: true,
    speed: "normal",
    status: "Inactive",
    displayOrder: 2,
    dismissible: true,
  },
  {
    title: "🪔 Happy Festive Season to all Students & Mentors",
    message:
      "✨ ApnaVidya wishes all our students, mentors and alumni a joyful and prosperous festive season! May your learning journey shine bright! 🌟",
    category: "Festival",
    link: "/about",
    linkText: "Join Our Community",
    theme: "festive",
    isMarquee: true,
    speed: "normal",
    status: "Inactive",
    displayOrder: 3,
    dismissible: true,
  },
  {
    title: "📢 Weekend Full Stack Batch Admissions Open",
    message:
      "🚀 Next cohort starts this Saturday! 1:1 Senior Mentor Support, Real Projects & 100% Placement Assistance. Book your seat before batch fills!",
    category: "Announcement",
    link: "/demo-class",
    linkText: "Book Free Demo",
    theme: "blue",
    isMarquee: true,
    speed: "normal",
    status: "Inactive",
    displayOrder: 4,
    dismissible: true,
  },
];

// Public: Get currently active alert notifications for client marquee banner
const getPublicAlerts = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const alerts = await AlertNotification.findAll({
      where: {
        status: "Active",
        [Op.and]: [
          {
            [Op.or]: [
              { startDate: null },
              { startDate: { [Op.lte]: today } },
            ],
          },
          {
            [Op.or]: [
              { endDate: null },
              { endDate: { [Op.gte]: today } },
            ],
          },
        ],
      },
      order: [
        ["displayOrder", "ASC"],
        ["updatedAt", "DESC"],
      ],
    });

    if (!alerts || alerts.length === 0) {
      // Check if any active exist without date constraints
      const fallbackActive = await AlertNotification.findAll({
        where: { status: "Active" },
        order: [["displayOrder", "ASC"]],
      });

      if (fallbackActive && fallbackActive.length > 0) {
        return res.status(200).json({
          success: true,
          data: { alerts: fallbackActive },
        });
      }

      // If database has no alerts at all, return default active alert
      return res.status(200).json({
        success: true,
        data: { alerts: DEFAULT_ALERTS.filter((a) => a.status === "Active") },
      });
    }

    return res.status(200).json({
      success: true,
      data: { alerts },
    });
  } catch (err) {
    console.error("Error fetching public alerts:", err);
    return res.status(200).json({
      success: true,
      data: { alerts: DEFAULT_ALERTS.filter((a) => a.status === "Active") },
    });
  }
};

// Admin: Get all alert notifications with filters, search, and statistics
const getAdminAlerts = async (req, res) => {
  try {
    const { search, status, category } = req.query;
    const where = {};

    if (status && status !== "All") {
      where.status = status;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.like]: q } },
        { message: { [Op.like]: q } },
        { link: { [Op.like]: q } },
        { linkText: { [Op.like]: q } },
      ];
    }

    const alerts = await AlertNotification.findAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    const total = await AlertNotification.count();
    const active = await AlertNotification.count({ where: { status: "Active" } });
    const inactive = await AlertNotification.count({ where: { status: "Inactive" } });
    const offers = await AlertNotification.count({ where: { category: "Offer" } });
    const maintenance = await AlertNotification.count({ where: { category: "Maintenance" } });
    const festivals = await AlertNotification.count({ where: { category: "Festival" } });

    return res.status(200).json({
      success: true,
      data: {
        alerts,
        stats: { total, active, inactive, offers, maintenance, festivals },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch alert notifications",
    });
  }
};

// Get single alert by ID
const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertNotification.findByPk(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { alert },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch alert notification",
    });
  }
};

// Create new alert notification
const createAlert = async (req, res) => {
  try {
    const {
      title,
      message,
      category = "Offer",
      link = "",
      linkText = "Learn More",
      theme = "orange",
      bgColor = "#FD8006",
      textColor = "#ffffff",
      isMarquee = true,
      speed = "normal",
      startDate = null,
      endDate = null,
      status = "Active",
      displayOrder = 1,
      dismissible = true,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const alert = await AlertNotification.create({
      title: title.trim(),
      message: message.trim(),
      category,
      link: link ? link.trim() : "",
      linkText: linkText ? linkText.trim() : "Learn More",
      theme: theme || "orange",
      bgColor: bgColor || "#FD8006",
      textColor: textColor || "#ffffff",
      isMarquee: isMarquee !== false,
      speed: speed || "normal",
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "Active",
      displayOrder: Number(displayOrder) || 1,
      dismissible: dismissible !== false,
    });

    return res.status(201).json({
      success: true,
      message: "Alert notification created successfully",
      data: { alert },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create alert notification",
    });
  }
};

// Update alert notification
const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertNotification.findByPk(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert notification not found",
      });
    }

    const {
      title,
      message,
      category,
      link,
      linkText,
      theme,
      bgColor,
      textColor,
      isMarquee,
      speed,
      startDate,
      endDate,
      status,
      displayOrder,
      dismissible,
    } = req.body;

    await alert.update({
      title: title !== undefined ? title.trim() : alert.title,
      message: message !== undefined ? message.trim() : alert.message,
      category: category !== undefined ? category : alert.category,
      link: link !== undefined ? link.trim() : alert.link,
      linkText: linkText !== undefined ? linkText.trim() : alert.linkText,
      theme: theme !== undefined ? theme : alert.theme,
      bgColor: bgColor !== undefined ? bgColor : alert.bgColor,
      textColor: textColor !== undefined ? textColor : alert.textColor,
      isMarquee: isMarquee !== undefined ? isMarquee : alert.isMarquee,
      speed: speed !== undefined ? speed : alert.speed,
      startDate: startDate !== undefined ? (startDate || null) : alert.startDate,
      endDate: endDate !== undefined ? (endDate || null) : alert.endDate,
      status: status !== undefined ? status : alert.status,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : alert.displayOrder,
      dismissible: dismissible !== undefined ? dismissible : alert.dismissible,
    });

    return res.status(200).json({
      success: true,
      message: "Alert notification updated successfully",
      data: { alert },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update alert notification",
    });
  }
};

// Toggle status (Active / Inactive)
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertNotification.findByPk(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert notification not found",
      });
    }

    const newStatus = alert.status === "Active" ? "Inactive" : "Active";
    await alert.update({ status: newStatus });

    return res.status(200).json({
      success: true,
      message: `Alert notification ${newStatus === "Active" ? "activated" : "deactivated"} successfully`,
      data: { alert },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to toggle alert status",
    });
  }
};

// Delete alert notification
const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertNotification.findByPk(id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert notification not found",
      });
    }

    await alert.destroy();

    return res.status(200).json({
      success: true,
      message: "Alert notification deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete alert notification",
    });
  }
};

// Bulk delete alerts
const bulkDeleteAlerts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of IDs to delete",
      });
    }

    const count = await AlertNotification.destroy({
      where: { id: { [Op.in]: ids } },
    });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${count} alert notification(s)`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete alert notifications",
    });
  }
};

module.exports = {
  DEFAULT_ALERTS,
  getPublicAlerts,
  getAdminAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  toggleStatus,
  deleteAlert,
  bulkDeleteAlerts,
};
