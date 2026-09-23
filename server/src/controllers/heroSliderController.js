const HeroSlider = require("../models/HeroSlider");

const getHeroSliders = async (req, res) => {
  try {
    const sliders = await HeroSlider.findAll({
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      data: { sliders },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch hero sliders",
    });
  }
};

const getHeroSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await HeroSlider.findByPk(id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Hero slider not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { slider },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch hero slider",
    });
  }
};

const createHeroSlider = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      buttonText = "Explore Courses",
      buttonUrl = "/courses",
      secondaryButtonText,
      secondaryButtonUrl,
      displayOrder = 1,
      startDate,
      endDate,
      status = "Active",
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Banner headline title is required",
      });
    }

    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      imageUrl =
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";
    }

    const slider = await HeroSlider.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : null,
      description: description ? description.trim() : null,
      image: imageUrl,
      buttonText: buttonText ? buttonText.trim() : "Explore Courses",
      buttonUrl: buttonUrl ? buttonUrl.trim() : "/courses",
      secondaryButtonText: secondaryButtonText ? secondaryButtonText.trim() : null,
      secondaryButtonUrl: secondaryButtonUrl ? secondaryButtonUrl.trim() : null,
      displayOrder: Number(displayOrder) || 1,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || null,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Hero banner created successfully",
      data: { slider },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create hero slider",
    });
  }
};

const updateHeroSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await HeroSlider.findByPk(id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Hero slider not found",
      });
    }

    const {
      title,
      subtitle,
      description,
      image,
      buttonText,
      buttonUrl,
      secondaryButtonText,
      secondaryButtonUrl,
      displayOrder,
      startDate,
      endDate,
      status,
    } = req.body;

    let imageUrl = image !== undefined ? image : slider.image;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await slider.update({
      title: title !== undefined ? title.trim() : slider.title,
      subtitle: subtitle !== undefined ? (subtitle ? subtitle.trim() : null) : slider.subtitle,
      description: description !== undefined ? (description ? description.trim() : null) : slider.description,
      image: imageUrl,
      buttonText: buttonText !== undefined ? buttonText.trim() : slider.buttonText,
      buttonUrl: buttonUrl !== undefined ? buttonUrl.trim() : slider.buttonUrl,
      secondaryButtonText: secondaryButtonText !== undefined ? (secondaryButtonText ? secondaryButtonText.trim() : null) : slider.secondaryButtonText,
      secondaryButtonUrl: secondaryButtonUrl !== undefined ? (secondaryButtonUrl ? secondaryButtonUrl.trim() : null) : slider.secondaryButtonUrl,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : slider.displayOrder,
      startDate: startDate !== undefined ? startDate : slider.startDate,
      endDate: endDate !== undefined ? endDate : slider.endDate,
      status: status !== undefined ? status : slider.status,
    });

    return res.status(200).json({
      success: true,
      message: "Hero banner updated successfully",
      data: { slider },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update hero slider",
    });
  }
};

const deleteHeroSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await HeroSlider.findByPk(id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Hero slider not found",
      });
    }

    await slider.destroy();

    return res.status(200).json({
      success: true,
      message: "Hero banner deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete hero slider",
    });
  }
};

const getPublicHeroSliders = async (req, res) => {
  try {
    const sliders = await HeroSlider.findAll({
      where: { status: "Active" },
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      data: { sliders },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch public hero sliders",
    });
  }
};

module.exports = {
  getHeroSliders,
  getHeroSliderById,
  createHeroSlider,
  updateHeroSlider,
  deleteHeroSlider,
  getPublicHeroSliders,
};
