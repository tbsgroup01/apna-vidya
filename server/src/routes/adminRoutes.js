const express = require("express");
const router = express.Router();
const {
  authenticate,
  authorizePermission,
} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const leadController = require("../controllers/leadController");
const studentController = require("../controllers/studentController");
const courseController = require("../controllers/courseController");
const batchController = require("../controllers/batchController");
const materialController = require("../controllers/materialController");
const syllabusController = require("../controllers/syllabusController");
const dashboardController = require("../controllers/dashboardController");
const awardController = require("../controllers/awardController");
const blogController = require("../controllers/blogController");
const heroSliderController = require("../controllers/heroSliderController");
const aboutController = require("../controllers/aboutController");
const videoSectionController = require("../controllers/videoSectionController");
const settingController = require("../controllers/settingController");
const uploadController = require("../controllers/uploadController");
const authController = require("../controllers/authController");
const holidayEmailController = require("../controllers/holidayEmailController");
const testimonialController = require("../controllers/testimonialController");

router.use(authenticate);
router.post("/upload", upload.any(), uploadController.uploadImage);
router.get("/profile", authController.getMe);
router.put("/profile", authController.updateProfile);
router.get("/dashboard/stats", dashboardController.getDashboardStats);
router.get("/users", authorizePermission("users.manage"), authController.getUsers);
router.post("/users", authorizePermission("users.manage"), authController.registerAdmin);
router.delete("/users/:id", authorizePermission("users.manage"), authController.deleteUser);


router.get(
  "/leads",
  authorizePermission("leads.view"),
  leadController.getLeads
);
router.post(
  "/leads/bulk-delete",
  authorizePermission("leads.delete"),
  leadController.bulkDeleteLeads
);
router.get(
  "/leads/:id",
  authorizePermission("leads.view"),
  leadController.getLeadById
);
router.post(
  "/leads",
  authorizePermission("leads.create"),
  leadController.createLead
);
router.put(
  "/leads/:id",
  authorizePermission("leads.edit"),
  leadController.updateLead
);
router.patch(
  "/leads/:id/status",
  authorizePermission("leads.edit"),
  leadController.updateLeadStatus
);
router.post(
  "/leads/:id/notes",
  authorizePermission("leads.edit"),
  leadController.addLeadNote
);
router.delete(
  "/leads/:id/notes/:noteId",
  authorizePermission("leads.edit"),
  leadController.deleteLeadNote
);
router.delete(
  "/leads/:id",
  authorizePermission("leads.delete"),
  leadController.deleteLead
);
router.post(
  "/leads/:id/convert",
  authorizePermission("leads.edit"),
  leadController.convertLead
);

router.get(
  "/students",
  authorizePermission("students.view"),
  studentController.getStudents
);
router.post(
  "/students/bulk-delete",
  authorizePermission("students.delete"),
  studentController.bulkDeleteStudents
);
router.get(
  "/students/:id",
  authorizePermission("students.view"),
  studentController.getStudentById
);
router.post(
  "/students",
  authorizePermission("students.create"),
  studentController.createStudent
);
router.put(
  "/students/:id",
  authorizePermission("students.edit"),
  studentController.updateStudent
);
router.delete(
  "/students/:id",
  authorizePermission("students.delete"),
  studentController.deleteStudent
);

router.get(
  "/courses/categories/all",
  authorizePermission("courses.view"),
  courseController.getCategories
);
router.post(
  "/courses/categories",
  authorizePermission("courses.create"),
  courseController.createCategory
);
router.put(
  "/courses/categories/:id",
  authorizePermission("courses.edit"),
  courseController.updateCategory
);
router.delete(
  "/courses/categories/:id",
  authorizePermission("courses.delete"),
  courseController.deleteCategory
);

router.get(
  "/courses",
  authorizePermission("courses.view"),
  courseController.getCourses
);
router.post(
  "/courses/bulk-delete",
  authorizePermission("courses.delete"),
  courseController.bulkDeleteCourses
);
router.get(
  "/courses/:id",
  authorizePermission("courses.view"),
  courseController.getCourseById
);
router.post(
  "/courses",
  authorizePermission("courses.create"),
  courseController.createCourse
);
router.put(
  "/courses/:id",
  authorizePermission("courses.edit"),
  courseController.updateCourse
);
router.delete(
  "/courses/:id",
  authorizePermission("courses.delete"),
  courseController.deleteCourse
);

router.post(
  "/courses/:id/modules",
  authorizePermission("courses.create"),
  courseController.createModule
);
router.put(
  "/courses/modules/:moduleId",
  authorizePermission("courses.edit"),
  courseController.updateModule
);
router.delete(
  "/courses/modules/:moduleId",
  authorizePermission("courses.delete"),
  courseController.deleteModule
);

router.post(
  "/courses/modules/:moduleId/lessons",
  authorizePermission("courses.create"),
  courseController.createLesson
);
router.put(
  "/courses/lessons/:lessonId",
  authorizePermission("courses.edit"),
  courseController.updateLesson
);
router.delete(
  "/courses/lessons/:lessonId",
  authorizePermission("courses.delete"),
  courseController.deleteLesson
);

router.get(
  "/batches",
  authorizePermission("batches.view"),
  batchController.getBatches
);
router.get(
  "/batches/:id",
  authorizePermission("batches.view"),
  batchController.getBatchById
);
router.post(
  "/batches",
  authorizePermission("batches.create"),
  batchController.createBatch
);
router.put(
  "/batches/:id",
  authorizePermission("batches.edit"),
  batchController.updateBatch
);
router.delete(
  "/batches/:id",
  authorizePermission("batches.delete"),
  batchController.deleteBatch
);

router.get(
  "/course-materials",
  authorizePermission("materials.view"),
  materialController.getMaterials
);
router.get(
  "/course-materials/:id",
  authorizePermission("materials.view"),
  materialController.getMaterialById
);
router.post(
  "/course-materials",
  authorizePermission("materials.create"),
  upload.single("file"),
  materialController.createMaterial
);
router.put(
  "/course-materials/:id",
  authorizePermission("materials.edit"),
  upload.single("file"),
  materialController.updateMaterial
);
router.delete(
  "/course-materials/:id",
  authorizePermission("materials.delete"),
  materialController.deleteMaterial
);

router.get(
  "/syllabus",
  authorizePermission("syllabus.view"),
  syllabusController.getSyllabusList
);
router.get(
  "/syllabus/:id",
  authorizePermission("syllabus.view"),
  syllabusController.getSyllabusById
);
router.post(
  "/syllabus",
  authorizePermission("syllabus.create"),
  upload.single("file"),
  syllabusController.createSyllabus
);
router.put(
  "/syllabus/:id",
  authorizePermission("syllabus.edit"),
  upload.single("file"),
  syllabusController.updateSyllabus
);
router.delete(
  "/syllabus/:id",
  authorizePermission("syllabus.delete"),
  syllabusController.deleteSyllabus
);

router.get(
  "/certificates",
  awardController.getAwards
);
router.post(
  "/certificates/bulk-delete",
  awardController.bulkDeleteAwards
);
router.get(
  "/certificates/:id",
  awardController.getAwardById
);
router.post(
  "/certificates",
  upload.single("image"),
  awardController.createAward
);
router.put(
  "/certificates/:id",
  upload.single("image"),
  awardController.updateAward
);
router.delete(
  "/certificates/:id",
  awardController.deleteAward
);

router.get(
  "/blogs",
  authorizePermission("content.view"),
  blogController.getBlogs
);
router.post(
  "/blogs/bulk-delete",
  authorizePermission("content.delete"),
  blogController.bulkDeleteBlogs
);
router.get(
  "/blogs/:id",
  authorizePermission("content.view"),
  blogController.getBlogById
);
router.post(
  "/blogs",
  authorizePermission("content.create"),
  upload.single("image"),
  blogController.createBlog
);
router.put(
  "/blogs/:id",
  authorizePermission("content.edit"),
  upload.single("image"),
  blogController.updateBlog
);
router.delete(
  "/blogs/:id",
  authorizePermission("content.delete"),
  blogController.deleteBlog
);

router.get(
  "/hero-sliders",
  authorizePermission("content.view"),
  heroSliderController.getHeroSliders
);
router.get(
  "/hero-sliders/:id",
  authorizePermission("content.view"),
  heroSliderController.getHeroSliderById
);
router.post(
  "/hero-sliders",
  authorizePermission("content.create"),
  upload.single("image"),
  heroSliderController.createHeroSlider
);
router.put(
  "/hero-sliders/:id",
  authorizePermission("content.edit"),
  upload.single("image"),
  heroSliderController.updateHeroSlider
);
router.delete(
  "/hero-sliders/:id",
  authorizePermission("content.delete"),
  heroSliderController.deleteHeroSlider
);

router.get(
  "/about",
  aboutController.getAboutContent
);
router.put(
  "/about",
  aboutController.updateAboutContent
);

router.get(
  "/video-section",
  videoSectionController.getVideoSection
);
router.put(
  "/video-section",
  videoSectionController.updateVideoSection
);
router.post(
  "/video-section/upload",
  upload.single("video"),
  videoSectionController.uploadVideo
);

router.get(
  "/settings",
  settingController.getSettings
);
router.put(
  "/settings",
  settingController.updateSettings
);
router.post(
  "/settings/test-email",
  settingController.sendTestEmail
);
router.put(
  "/settings/change-password",
  settingController.changePassword
);

router.get("/holiday-emails", holidayEmailController.getHolidayEmails);
router.get("/holiday-emails/audience-stats", holidayEmailController.getAudienceStats);
router.get("/holiday-emails/:id", holidayEmailController.getHolidayEmailById);
router.post("/holiday-emails", holidayEmailController.createHolidayEmail);
router.post("/holiday-emails/:id/send", holidayEmailController.sendHolidayEmailNow);
router.delete("/holiday-emails/:id", holidayEmailController.deleteHolidayEmail);
router.post("/holiday-emails/bulk-delete", holidayEmailController.bulkDeleteHolidayEmails);

router.get("/testimonials", testimonialController.getAdminTestimonials);
router.get("/testimonials/:id", testimonialController.getTestimonialById);
router.post("/testimonials", upload.any(), testimonialController.createTestimonial);
router.put("/testimonials/:id", upload.any(), testimonialController.updateTestimonial);
router.delete("/testimonials/:id", testimonialController.deleteTestimonial);
router.post("/testimonials/bulk-delete", testimonialController.bulkDeleteTestimonials);

module.exports = router;
