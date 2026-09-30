const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const courseController = require("../controllers/courseController");
const syllabusController = require("../controllers/syllabusController");
const awardController = require("../controllers/awardController");
const blogController = require("../controllers/blogController");
const heroSliderController = require("../controllers/heroSliderController");
const aboutController = require("../controllers/aboutController");
const settingController = require("../controllers/settingController");
const videoSectionController = require("../controllers/videoSectionController");
const upload = require("../middlewares/uploadMiddleware");
const uploadController = require("../controllers/uploadController");

router.post("/upload", upload.any(), uploadController.uploadImage);

router.post("/leads", leadController.createPublicLead);
router.post("/leads/demo", (req, res, next) => {
  req.body.source = "Demo Class";
  return leadController.createPublicLead(req, res, next);
});
router.post("/leads/contact", (req, res, next) => {
  req.body.source = "Contact Form";
  return leadController.createPublicLead(req, res, next);
});
router.post("/leads/course", (req, res, next) => {
  req.body.source = "Course Enquiry";
  return leadController.createPublicLead(req, res, next);
});

router.get("/categories", courseController.getCategories);
router.get("/courses", courseController.getCourses);
router.get("/courses/:id", courseController.getCourseById);
router.get("/syllabus", syllabusController.getSyllabusList);
router.get("/certificates", awardController.getPublicAwards);
router.get("/blogs", blogController.getPublicBlogs);
router.get("/blogs/categories/list", blogController.getBlogCategories);
router.get("/blogs/:slug", blogController.getPublicBlogBySlug);
router.get("/hero-sliders", heroSliderController.getPublicHeroSliders);
router.get("/about", aboutController.getPublicAboutContent);
router.get("/video-section", videoSectionController.getPublicVideoSection);
router.get("/settings", settingController.getPublicSettings);
router.get("/settings/contact", settingController.getPublicContactSettings);

module.exports = router;


