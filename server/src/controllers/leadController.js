const { Op } = require("sequelize");
const Lead = require("../models/Lead");
const LeadNote = require("../models/LeadNote");
const LeadActivity = require("../models/LeadActivity");
const Student = require("../models/Student");
const StudentCourse = require("../models/StudentCourse");
const StudentBatch = require("../models/StudentBatch");
const Batch = require("../models/Batch");
const Course = require("../models/Course");
const { sendEmailFromSettings } = require("./settingController");

const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      course,
      assignedTo,
      source,
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
        { city: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (course && course !== "All") {
      where.course = { [Op.like]: `%${course}%` };
    }

    if (assignedTo && assignedTo !== "All") {
      where.assignedTo = assignedTo;
    }

    if (source && source !== "All") {
      where.source = { [Op.like]: `%${source}%` };
    }

    const { count, rows: leads } = await Lead.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        {
          model: LeadNote,
          as: "notes",
          attributes: ["id", "author", "text", "createdAt"],
        },
        {
          model: LeadActivity,
          as: "timeline",
          attributes: ["id", "action", "detail", "createdAt"],
        },
      ],
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        leads,
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
      message: err.message || "Failed to fetch leads",
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id, {
      include: [
        {
          model: LeadNote,
          as: "notes",
          order: [["createdAt", "DESC"]],
        },
        {
          model: LeadActivity,
          as: "timeline",
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { lead },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve lead details",
    });
  }
};

const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      course,
      source = "Manual Entry",
      status = "New",
      assignedTo = "Unassigned",
      city,
      qualification,
      initialNote,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      course,
      source,
      status,
      assignedTo,
      city,
      qualification,
    });

    await LeadActivity.create({
      leadId: lead.id,
      action: "Lead Created",
      detail: `Created manually by staff (${req.user?.name || "Admin"})`,
    });

    if (initialNote) {
      await LeadNote.create({
        leadId: lead.id,
        author: req.user?.name || "Staff",
        text: initialNote,
      });
    }

    const completeLead = await Lead.findByPk(lead.id, {
      include: [
        { model: LeadNote, as: "notes" },
        { model: LeadActivity, as: "timeline" },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: { lead: completeLead },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create lead",
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const {
      name,
      email,
      phone,
      course,
      source,
      status,
      assignedTo,
      city,
      qualification,
    } = req.body;

    const previousStatus = lead.status;

    await lead.update({
      name: name !== undefined ? name : lead.name,
      email: email !== undefined ? email : lead.email,
      phone: phone !== undefined ? phone : lead.phone,
      course: course !== undefined ? course : lead.course,
      source: source !== undefined ? source : lead.source,
      status: status !== undefined ? status : lead.status,
      assignedTo: assignedTo !== undefined ? assignedTo : lead.assignedTo,
      city: city !== undefined ? city : lead.city,
      qualification:
        qualification !== undefined ? qualification : lead.qualification,
    });

    if (status && status !== previousStatus) {
      await LeadActivity.create({
        leadId: lead.id,
        action: "Status Updated",
        detail: `Status changed from "${previousStatus}" to "${status}" by ${
          req.user?.name || "Staff"
        }`,
      });
    }

    const updatedLead = await Lead.findByPk(lead.id, {
      include: [
        { model: LeadNote, as: "notes" },
        { model: LeadActivity, as: "timeline" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: { lead: updatedLead },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update lead",
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();

    await LeadActivity.create({
      leadId: lead.id,
      action: "Status Changed",
      detail: `Changed from "${oldStatus}" to "${status}" by ${
        req.user?.name || "Staff"
      }`,
    });

    return res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}`,
      data: { lead },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update lead status",
    });
  }
};

const addLeadNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content cannot be empty",
      });
    }

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const note = await LeadNote.create({
      leadId: lead.id,
      author: req.user?.name || "Counsellor Staff",
      text: text.trim(),
    });

    await LeadActivity.create({
      leadId: lead.id,
      action: "Note Added",
      detail: `New counselling note added by ${req.user?.name || "Staff"}`,
    });

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: { note },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to add lead note",
    });
  }
};

const deleteLeadNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await LeadNote.findByPk(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    await note.destroy();
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete note",
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await lead.destroy();
    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete lead",
    });
  }
};

const convertLead = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      courseId,
      batchId,
      totalFees = 32000,
      paidFees = 0,
      admissionDate = new Date().toISOString().split("T")[0],
      notes,
    } = req.body;

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    let student = null;
    if (lead.email) {
      student = await Student.findOne({ where: { email: lead.email } });
    }

    const pendingFees = Math.max(0, Number(totalFees) - Number(paidFees));
    const paymentStatus =
      pendingFees === 0 ? "Paid" : Number(paidFees) > 0 ? "Partial" : "Pending";

    if (!student) {
      student = await Student.create({
        name: lead.name,
        email: lead.email || `student.${Date.now()}@apnavidya.com`,
        phone: lead.phone,
        address: lead.city || "Not Provided",
        admissionDate,
        status: "Active",
        totalFees: Number(totalFees),
        paidFees: Number(paidFees),
        pendingFees,
        paymentStatus,
        notes: notes || `Converted from Lead ID #${lead.id} (${lead.source})`,
      });
    } else {
      await student.update({
        totalFees: Number(totalFees),
        paidFees: Number(paidFees),
        pendingFees,
        paymentStatus,
      });
    }

    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (course) {
        await StudentCourse.findOrCreate({
          where: { studentId: student.id, courseId: course.id },
          defaults: {
            studentId: student.id,
            courseId: course.id,
            status: "Enrolled",
            enrolledAt: admissionDate,
          },
        });
      }
    }

    if (batchId) {
      const batch = await Batch.findByPk(batchId);
      if (batch) {
        const [sb, created] = await StudentBatch.findOrCreate({
          where: { studentId: student.id, batchId: batch.id },
          defaults: {
            studentId: student.id,
            batchId: batch.id,
            joinedAt: admissionDate,
          },
        });
        if (created) {
          await batch.increment("enrolledCount");
        }
      }
    }

    lead.status = "Converted";
    await lead.save();

    await LeadActivity.create({
      leadId: lead.id,
      action: "Lead Converted",
      detail: `Successfully converted into Student Record #${student.id} (${
        student.name
      }) by ${req.user?.name || "Staff"}`,
    });

    const enrolledStudent = await Student.findByPk(student.id, {
      include: [
        { model: Course, as: "enrolledCourses" },
        { model: Batch, as: "enrolledBatches" },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Lead converted to enrolled student successfully",
      data: {
        student: enrolledStudent,
        lead,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to convert lead",
    });
  }
};

const createPublicLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      course,
      source = "Website Form",
      city,
      qualification,
      message,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required",
      });
    }

    const lead = await Lead.create({
      name,
      email: email || null,
      phone,
      course: course || "General Inquiry",
      source,
      status: "New",
      city: city || null,
      qualification: qualification || null,
    });

    await LeadActivity.create({
      leadId: lead.id,
      action: "Lead Inquired",
      detail: `Online visitor submitted enquiry from: ${source}`,
    });

    if (message) {
      await LeadNote.create({
        leadId: lead.id,
        author: "Visitor (Self)",
        text: message,
      });
    }

    if (email && email.includes("@")) {
      sendEmailFromSettings({
        to: email,
        subject: `Thank you for contacting Apna Vidya - ${course || "Admissions"}`,
        text: `Hello ${name},\n\nThank you for reaching out to Apna Vidya regarding "${course || "Admissions"}".\nOur senior academic counselor has received your inquiry and will contact you at ${phone} shortly.\n\nWarm regards,\nApna Vidya Admissions Team`,
      }).catch(() => {});
    }

    return res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Our academic counselor will get in touch shortly.",
      data: { leadId: lead.id },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to record inquiry",
    });
  }
};

const bulkDeleteLeads = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of lead IDs is required for bulk deletion",
      });
    }
    const count = await Lead.destroy({
      where: {
        id: ids,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${count} lead(s) deleted successfully`,
      data: { count, deletedIds: ids },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to bulk delete leads",
    });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  addLeadNote,
  deleteLeadNote,
  deleteLead,
  bulkDeleteLeads,
  convertLead,
  createPublicLead,
};
