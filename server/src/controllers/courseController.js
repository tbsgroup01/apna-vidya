const { Op } = require("sequelize");
const Course = require("../models/Course");
const CourseCategory = require("../models/CourseCategory");
const CourseModule = require("../models/CourseModule");
const CourseLesson = require("../models/CourseLesson");
const Batch = require("../models/Batch");
const Student = require("../models/Student");
const CourseMaterial = require("../models/CourseMaterial");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const handleSequelizeError = (err, defaultMsg = "An error occurred") => {
  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors?.[0]?.path || "record";
    return `A record with this ${field} already exists.`;
  }
  if (err.name === "SequelizeValidationError" && err.errors?.length > 0) {
    return err.errors.map((e) => e.message).join(", ");
  }
  return err.message || defaultMsg;
};

const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      category,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (category && category !== "All") {
      where.categoryId = Number(category);
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, order.toUpperCase()]],
      include: [
        { model: CourseCategory, as: "category", attributes: ["id", "name", "slug"] },
        { model: CourseModule, as: "modules", attributes: ["id", "title"] },
        { model: Batch, as: "batches", attributes: ["id", "name", "status"] },
      ],
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        courses,
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
      message: err.message || "Failed to fetch courses",
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const where = isNaN(id) ? { slug: id } : { id: Number(id) };

    const course = await Course.findOne({
      where,
      include: [
        { model: CourseCategory, as: "category" },
        {
          model: CourseModule,
          as: "modules",
          include: [
            {
              model: CourseLesson,
              as: "lessons",
              order: [["orderIndex", "ASC"]],
            },
            {
              model: CourseMaterial,
              as: "materials",
            },
          ],
        },
        { model: Batch, as: "batches" },
        {
          model: Student,
          as: "enrolledStudents",
          attributes: ["id", "name", "email", "phone", "profileImage", "status"],
          through: { attributes: ["status", "enrolledAt"] },
        },
      ],
      order: [
        [{ model: CourseModule, as: "modules" }, "orderIndex", "ASC"],
      ],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { course },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch course details",
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      duration = "6 Months",
      level = "All Levels",
      fees = 0,
      categoryId,
      status = "Active",
      featured = false,
      learningOutcomes,
      prerequisites,
      certificateInfo,
      classFormat,
      batchTiming,
      lmsAccess,
      doubtResolution,
      targetAudience,
      faqs,
      fullOverview,
      syllabusUrl,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Course program name is required",
      });
    }

    const courseSlug = slug ? slugify(slug) : slugify(name);

    const existingSlug = await Course.findOne({ where: { slug: courseSlug } });
    const finalSlug = existingSlug ? `${courseSlug}-${Date.now()}` : courseSlug;

    const course = await Course.create({
      name,
      slug: finalSlug,
      description,
      image:
        image ||
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80",
      duration,
      level,
      fees: Number(fees),
      categoryId: categoryId ? Number(categoryId) : null,
      status,
      featured: Boolean(featured),
      learningOutcomes: learningOutcomes !== undefined ? learningOutcomes : null,
      prerequisites: prerequisites || null,
      certificateInfo: certificateInfo || null,
      classFormat: classFormat || "100% Live Online",
      batchTiming: batchTiming || "Weekday / Weekend",
      lmsAccess: lmsAccess || "Lifetime Validity",
      doubtResolution: doubtResolution || "Daily Live Windows",
      targetAudience: targetAudience || null,
      faqs: faqs !== undefined ? faqs : null,
      fullOverview: fullOverview || null,
      syllabusUrl: syllabusUrl || null,
    });

    return res.status(201).json({
      success: true,
      message: "Course published successfully",
      data: { course },
    });
  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(400).json({
      success: false,
      message: handleSequelizeError(err, "Failed to create course"),
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const {
      name,
      slug,
      description,
      image,
      duration,
      level,
      fees,
      categoryId,
      status,
      featured,
      learningOutcomes,
      prerequisites,
      certificateInfo,
      classFormat,
      batchTiming,
      lmsAccess,
      doubtResolution,
      targetAudience,
      faqs,
      fullOverview,
      syllabusUrl,
    } = req.body;

    let finalSlug = course.slug;
    if (slug && slug !== course.slug) {
      finalSlug = slugify(slug);
    } else if (name && name !== course.name && !slug) {
      finalSlug = slugify(name);
    }

    await course.update({
      name: name !== undefined ? name : course.name,
      slug: finalSlug,
      description: description !== undefined ? description : course.description,
      image: image !== undefined ? image : course.image,
      duration: duration !== undefined ? duration : course.duration,
      level: level !== undefined ? level : course.level,
      fees: fees !== undefined ? Number(fees) : course.fees,
      categoryId: categoryId !== undefined ? Number(categoryId) : course.categoryId,
      status: status !== undefined ? status : course.status,
      featured: featured !== undefined ? Boolean(featured) : course.featured,
      learningOutcomes: learningOutcomes !== undefined ? learningOutcomes : course.learningOutcomes,
      prerequisites: prerequisites !== undefined ? prerequisites : course.prerequisites,
      certificateInfo: certificateInfo !== undefined ? certificateInfo : course.certificateInfo,
      classFormat: classFormat !== undefined ? classFormat : course.classFormat,
      batchTiming: batchTiming !== undefined ? batchTiming : course.batchTiming,
      lmsAccess: lmsAccess !== undefined ? lmsAccess : course.lmsAccess,
      doubtResolution: doubtResolution !== undefined ? doubtResolution : course.doubtResolution,
      targetAudience: targetAudience !== undefined ? targetAudience : course.targetAudience,
      faqs: faqs !== undefined ? faqs : course.faqs,
      fullOverview: fullOverview !== undefined ? fullOverview : course.fullOverview,
      syllabusUrl: syllabusUrl !== undefined ? syllabusUrl : course.syllabusUrl,
    });

    const updated = await Course.findByPk(course.id, {
      include: [{ model: CourseCategory, as: "category" }],
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: { course: updated },
    });
  } catch (err) {
    console.error("Error updating course:", err);
    return res.status(400).json({
      success: false,
      message: handleSequelizeError(err, "Failed to update course"),
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.destroy();
    return res.status(200).json({
      success: true,
      message: "Course program deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete course",
    });
  }
};

const bulkDeleteCourses = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of course IDs is required for bulk deletion",
      });
    }
    const count = await Course.destroy({
      where: {
        id: ids,
      },
    });
    return res.status(200).json({
      success: true,
      message: `${count} course program(s) deleted successfully`,
      data: { count, deletedIds: ids },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to bulk delete courses",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await CourseCategory.findAll({
      include: [{ model: Course, as: "courses", attributes: ["id", "name"] }],
      order: [["name", "ASC"]],
    });
    return res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch categories",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon = "BookOpen" } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();
    const catSlug = slug ? slugify(slug) : slugify(trimmedName);

    // If category with this name or slug already exists, return existing cleanly
    const existing = await CourseCategory.findOne({
      where: {
        [Op.or]: [{ name: trimmedName }, { slug: catSlug }],
      },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Category already exists",
        data: { category: existing },
      });
    }

    const category = await CourseCategory.create({
      name: trimmedName,
      slug: catSlug,
      description: description || null,
      icon,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  } catch (err) {
    console.error("Error creating category:", err);
    return res.status(400).json({
      success: false,
      message: handleSequelizeError(err, "Failed to create category"),
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CourseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name, slug, description, icon } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slugify(slug);
    else if (name !== undefined) updateData.slug = slugify(name);
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;

    if (updateData.name || updateData.slug) {
      const duplicate = await CourseCategory.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            ...(updateData.name ? [{ name: updateData.name }] : []),
            ...(updateData.slug ? [{ slug: updateData.slug }] : []),
          ],
        },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Another category with this name or slug already exists",
        });
      }
    }

    await category.update(updateData);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { category },
    });
  } catch (err) {
    console.error("Error updating category:", err);
    return res.status(400).json({
      success: false,
      message: handleSequelizeError(err, "Failed to update category"),
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CourseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.destroy();
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(400).json({
      success: false,
      message: handleSequelizeError(err, "Failed to delete category"),
    });
  }
};

const createModule = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { title, duration = "4 Weeks", orderIndex } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Module title is required",
      });
    }

    const count = await CourseModule.count({ where: { courseId: Number(courseId) } });
    const moduleItem = await CourseModule.create({
      courseId: Number(courseId),
      title,
      duration,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : count + 1,
    });

    return res.status(201).json({
      success: true,
      message: "Curriculum module created",
      data: { module: moduleItem },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create curriculum module",
    });
  }
};

const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleItem = await CourseModule.findByPk(moduleId);
    if (!moduleItem) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const { title, duration, orderIndex } = req.body;
    await moduleItem.update({
      title: title !== undefined ? title : moduleItem.title,
      duration: duration !== undefined ? duration : moduleItem.duration,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : moduleItem.orderIndex,
    });

    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: { module: moduleItem },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update module",
    });
  }
};

const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const moduleItem = await CourseModule.findByPk(moduleId);
    if (!moduleItem) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    await moduleItem.destroy();
    return res.status(200).json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete module",
    });
  }
};

const createLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, duration = "45 mins", type = "Video", content, orderIndex } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Lesson title is required",
      });
    }

    const count = await CourseLesson.count({ where: { moduleId: Number(moduleId) } });
    const lesson = await CourseLesson.create({
      moduleId: Number(moduleId),
      title,
      duration,
      type,
      content,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : count + 1,
    });

    return res.status(201).json({
      success: true,
      message: "Lesson added to module",
      data: { lesson },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create lesson",
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await CourseLesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const { title, duration, type, content, orderIndex } = req.body;
    await lesson.update({
      title: title !== undefined ? title : lesson.title,
      duration: duration !== undefined ? duration : lesson.duration,
      type: type !== undefined ? type : lesson.type,
      content: content !== undefined ? content : lesson.content,
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : lesson.orderIndex,
    });

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: { lesson },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update lesson",
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await CourseLesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    await lesson.destroy();
    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete lesson",
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  bulkDeleteCourses,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
};
