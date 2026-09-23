const { Op } = require("sequelize");
const Blog = require("../models/Blog");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      category,
      status,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (status && status !== "All") {
      where.status = status;
    }

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [
        ["featured", "DESC"],
        [sortBy, order.toUpperCase()],
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        blogs,
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
      message: err.message || "Failed to fetch blogs",
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { blog },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch blog post",
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      category = "Technology",
      author = "Apna Vidya Editorial",
      authorRole = "Senior Mentor",
      publishedDate,
      readTime = "5 min read",
      excerpt,
      content,
      tags,
      status = "Published",
      featured = false,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Article title is required",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Article body content is required",
      });
    }

    let slug = customSlug ? slugify(customSlug) : slugify(title);
    const existing = await Blog.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let imageUrl = req.body.featuredImage;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      imageUrl =
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80";
    }

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      category: category ? category.trim() : "Technology",
      author: author ? author.trim() : "Apna Vidya Editorial",
      authorRole: authorRole ? authorRole.trim() : "Senior Mentor",
      publishedDate: publishedDate || new Date().toISOString().split("T")[0],
      readTime: readTime ? readTime.trim() : "5 min read",
      featuredImage: imageUrl,
      excerpt: excerpt ? excerpt.trim() : null,
      content,
      tags: tags ? (Array.isArray(tags) ? tags.join(", ") : String(tags).trim()) : null,
      status,
      featured: featured === "true" || featured === true,
      views: 0,
      seoTitle: seoTitle ? seoTitle.trim() : null,
      seoDescription: seoDescription ? seoDescription.trim() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Blog article published successfully",
      data: { blog },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create blog",
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const {
      title,
      slug: newSlug,
      category,
      author,
      authorRole,
      publishedDate,
      readTime,
      featuredImage,
      excerpt,
      content,
      tags,
      status,
      featured,
      seoTitle,
      seoDescription,
    } = req.body;

    let targetSlug = blog.slug;
    if (newSlug && slugify(newSlug) !== blog.slug) {
      targetSlug = slugify(newSlug);
      const existing = await Blog.findOne({
        where: { slug: targetSlug, id: { [Op.ne]: id } },
      });
      if (existing) {
        targetSlug = `${targetSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    let imageUrl = featuredImage !== undefined ? featuredImage : blog.featuredImage;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await blog.update({
      title: title !== undefined ? title.trim() : blog.title,
      slug: targetSlug,
      category: category !== undefined ? category.trim() : blog.category,
      author: author !== undefined ? author.trim() : blog.author,
      authorRole: authorRole !== undefined ? authorRole.trim() : blog.authorRole,
      publishedDate: publishedDate !== undefined ? publishedDate : blog.publishedDate,
      readTime: readTime !== undefined ? readTime.trim() : blog.readTime,
      featuredImage: imageUrl,
      excerpt: excerpt !== undefined ? (excerpt ? excerpt.trim() : null) : blog.excerpt,
      content: content !== undefined ? content : blog.content,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags.join(", ") : String(tags).trim()) : blog.tags,
      status: status !== undefined ? status : blog.status,
      featured: featured !== undefined ? (featured === "true" || featured === true) : blog.featured,
      seoTitle: seoTitle !== undefined ? (seoTitle ? seoTitle.trim() : null) : blog.seoTitle,
      seoDescription: seoDescription !== undefined ? (seoDescription ? seoDescription.trim() : null) : blog.seoDescription,
    });

    return res.status(200).json({
      success: true,
      message: "Blog article updated successfully",
      data: { blog },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update blog",
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    await blog.destroy();

    return res.status(200).json({
      success: true,
      message: "Blog article deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete blog",
    });
  }
};

const bulkDeleteBlogs = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of blog IDs is required for bulk deletion",
      });
    }
    const count = await Blog.destroy({
      where: {
        id: ids,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${count} blog article(s) deleted successfully`,
      data: { count, deletedIds: ids },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to bulk delete blogs",
    });
  }
};

const getPublicBlogs = async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;
    const where = { status: "Published" };

    if (category && category !== "All") {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
      ];
    }

    const blogs = await Blog.findAll({
      where,
      limit: Number(limit),
      order: [
        ["featured", "DESC"],
        ["publishedDate", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return res.status(200).json({
      success: true,
      data: { blogs },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch public blogs",
    });
  }
};

const getPublicBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({
      where: {
        slug,
        status: "Published",
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    try {
      await blog.increment("views", { by: 1 });
    } catch (incErr) {
      console.error(incErr);
    }

    return res.status(200).json({
      success: true,
      data: { blog },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch article details",
    });
  }
};

const getBlogCategories = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { status: "Published" },
      attributes: ["category"],
      group: ["category"],
    });

    const categories = blogs.map((b) => b.category).filter(Boolean);
    return res.status(200).json({
      success: true,
      data: { categories: ["All", ...categories] },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch categories",
    });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  bulkDeleteBlogs,
  getPublicBlogs,
  getPublicBlogBySlug,
  getBlogCategories,
};
