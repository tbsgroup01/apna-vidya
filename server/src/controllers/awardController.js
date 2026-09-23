const { Op } = require("sequelize");
const Award = require("../models/Award");

const getAwards = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      category,
      status,
      sortBy = "orderIndex",
      order = "ASC",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { issuer: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (status && status !== "All") {
      where.status = status;
    }

    const { count, rows: awards } = await Award.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [
        [sortBy, order.toUpperCase()],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        awards,
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
      message: err.message || "Failed to fetch awards",
    });
  }
};

const getAwardById = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { award },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch award details",
    });
  }
};

const createAward = async (req, res) => {
  try {
    const {
      title,
      issuer,
      category = "Accreditation",
      year = "2025",
      verificationUrl,
      description,
      status = "Active",
      featured = true,
      orderIndex = 0,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Award or certificate title is required",
      });
    }

    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=600&q=80";
    }

    const award = await Award.create({
      title: title.trim(),
      issuer: issuer ? issuer.trim() : null,
      category: category ? category.trim() : null,
      year: year ? String(year).trim() : "2025",
      image: imageUrl,
      verificationUrl: verificationUrl ? verificationUrl.trim() : null,
      description: description ? description.trim() : null,
      status,
      featured: featured === "true" || featured === true,
      orderIndex: Number(orderIndex) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Award / Certificate added successfully",
      data: { award },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create award",
    });
  }
};

const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    const {
      title,
      issuer,
      category,
      year,
      image,
      verificationUrl,
      description,
      status,
      featured,
      orderIndex,
    } = req.body;

    let imageUrl = image !== undefined ? image : award.image;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await award.update({
      title: title !== undefined ? title.trim() : award.title,
      issuer: issuer !== undefined ? (issuer ? issuer.trim() : null) : award.issuer,
      category: category !== undefined ? (category ? category.trim() : null) : award.category,
      year: year !== undefined ? String(year).trim() : award.year,
      image: imageUrl,
      verificationUrl: verificationUrl !== undefined ? (verificationUrl ? verificationUrl.trim() : null) : award.verificationUrl,
      description: description !== undefined ? (description ? description.trim() : null) : award.description,
      status: status !== undefined ? status : award.status,
      featured: featured !== undefined ? (featured === "true" || featured === true) : award.featured,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : award.orderIndex,
    });

    return res.status(200).json({
      success: true,
      message: "Award / Certificate updated successfully",
      data: { award },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update award",
    });
  }
};

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByPk(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    await award.destroy();

    return res.status(200).json({
      success: true,
      message: "Award / Certificate deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete award",
    });
  }
};

const bulkDeleteAwards = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of award IDs is required for bulk deletion",
      });
    }
    const count = await Award.destroy({
      where: {
        id: ids,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${count} award(s) deleted successfully`,
      data: { count, deletedIds: ids },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to bulk delete awards",
    });
  }
};

const getPublicAwards = async (req, res) => {
  try {
    const awards = await Award.findAll({
      where: { status: "Active" },
      order: [
        ["featured", "DESC"],
        ["orderIndex", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      data: { awards },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch public awards",
    });
  }
};

module.exports = {
  getAwards,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
  bulkDeleteAwards,
  getPublicAwards,
};
