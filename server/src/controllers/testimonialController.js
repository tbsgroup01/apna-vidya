const { Op } = require("sequelize");
const Testimonial = require("../models/Testimonial");

const DEFAULT_TESTIMONIALS = [
  {
    name: "Rohan Kulkarni",
    role: "Full Stack Engineer at Innovaccer",
    course: "Full Stack Development",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    review:
      "Coming from a non-CS background, I was terrified of learning React and Node.js. ApnaVidya's daily doubt clearance and mentor code reviews gave me the exact confidence I needed. Cracked a 9 LPA package within 5 months!",
    company: "Innovaccer",
    displayOrder: 1,
    status: "Active",
  },
  {
    name: "Ananya Deshmukh",
    role: "Frontend Developer at Razorpay",
    course: "Web Development",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    review:
      "The practical projects in the Web Dev course are genuinely industry-grade. The mentors don't just explain concepts, they teach how to debug like a senior engineer. Best investment I made in my career.",
    company: "Razorpay",
    displayOrder: 2,
    status: "Active",
  },
  {
    name: "Aditya Verma",
    role: "Scored 96.4% in CBSE Class 12 Boards",
    course: "School Curriculum",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    review:
      "The chapter-wise formula cheat sheets and mock test evaluations pinpointed exactly where I was losing marks. My physics and maths marks improved dramatically in just 3 months!",
    company: "CBSE Topper",
    displayOrder: 3,
    status: "Active",
  },
  {
    name: "Pooja Sharma",
    role: "Data Analyst at Infosys",
    course: "Data Science & Python",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    review:
      "The structured curriculum covering SQL, Python, and Tableau helped me transition smoothly from non-tech to analytics. Highly recommended for beginners and working professionals!",
    company: "Infosys",
    displayOrder: 4,
    status: "Active",
  },
  {
    name: "Vikram Rathore",
    role: "Cloud Engineer at TCS",
    course: "DevOps & Cloud Computing",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    review:
      "Hands-on labs on AWS and Docker gave me real-world problem-solving skills. The mentors guided me through mock interviews until I felt 100% prepared.",
    company: "TCS",
    displayOrder: 5,
    status: "Active",
  },
];

// Public: Get all active testimonials
const getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { status: "Active" },
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    if (!testimonials || testimonials.length === 0) {
      return res.status(200).json({
        success: true,
        data: { testimonials: DEFAULT_TESTIMONIALS },
      });
    }

    return res.status(200).json({
      success: true,
      data: { testimonials },
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      data: { testimonials: DEFAULT_TESTIMONIALS },
    });
  }
};

// Admin: Get testimonials with search, status filters & stats
const getAdminTestimonials = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (status && status !== "All") {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: q } },
        { role: { [Op.like]: q } },
        { course: { [Op.like]: q } },
        { company: { [Op.like]: q } },
        { review: { [Op.like]: q } },
      ];
    }

    const testimonials = await Testimonial.findAll({
      where,
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    const total = await Testimonial.count();
    const active = await Testimonial.count({ where: { status: "Active" } });
    const inactive = await Testimonial.count({ where: { status: "Inactive" } });

    return res.status(200).json({
      success: true,
      data: {
        testimonials,
        stats: { total, active, inactive },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch testimonials",
    });
  }
};

// Get single testimonial by ID
const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { testimonial },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch testimonial",
    });
  }
};

// Create new testimonial
const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      role,
      course,
      rating = 5,
      avatar,
      review,
      company,
      displayOrder = 1,
      status = "Active",
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Student name is required.",
      });
    }

    if (!review || !review.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review content is required.",
      });
    }

    let avatarUrl = avatar;
    if (req.files && req.files.length > 0) {
      avatarUrl = `/uploads/${req.files[0].filename}`;
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      role: role ? role.trim() : null,
      course: course ? course.trim() : null,
      rating: Number(rating) || 5,
      avatar: avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      review: review.trim(),
      company: company ? company.trim() : null,
      displayOrder: Number(displayOrder) || 1,
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      data: { testimonial },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create testimonial",
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const {
      name,
      role,
      course,
      rating,
      avatar,
      review,
      company,
      displayOrder,
      status,
    } = req.body;

    let avatarUrl = avatar !== undefined ? avatar : testimonial.avatar;
    if (req.files && req.files.length > 0) {
      avatarUrl = `/uploads/${req.files[0].filename}`;
    }

    await testimonial.update({
      name: name !== undefined ? name.trim() : testimonial.name,
      role: role !== undefined ? (role ? role.trim() : null) : testimonial.role,
      course: course !== undefined ? (course ? course.trim() : null) : testimonial.course,
      rating: rating !== undefined ? Number(rating) : testimonial.rating,
      avatar: avatarUrl,
      review: review !== undefined ? review.trim() : testimonial.review,
      company: company !== undefined ? (company ? company.trim() : null) : testimonial.company,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : testimonial.displayOrder,
      status: status !== undefined ? status : testimonial.status,
    });

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data: { testimonial },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update testimonial",
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await testimonial.destroy();

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete testimonial",
    });
  }
};

// Bulk delete testimonials
const bulkDeleteTestimonials = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of IDs to delete.",
      });
    }

    await Testimonial.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `${ids.length} testimonials deleted successfully.`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to bulk delete testimonials",
    });
  }
};

module.exports = {
  DEFAULT_TESTIMONIALS,
  getPublicTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  bulkDeleteTestimonials,
};
