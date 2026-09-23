const uploadImage = async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided for upload",
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: fileUrl,
      data: {
        url: fileUrl,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process image upload",
    });
  }
};

module.exports = {
  uploadImage,
};
