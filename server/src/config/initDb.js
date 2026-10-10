const { sequelize } = require("./db");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");
const User = require("../models/User");
const Lead = require("../models/Lead");
const LeadNote = require("../models/LeadNote");
const LeadActivity = require("../models/LeadActivity");
const Student = require("../models/Student");
const StudentCourse = require("../models/StudentCourse");
const StudentBatch = require("../models/StudentBatch");
const CourseCategory = require("../models/CourseCategory");
const Course = require("../models/Course");
const CourseModule = require("../models/CourseModule");
const CourseLesson = require("../models/CourseLesson");
const Batch = require("../models/Batch");
const CourseMaterial = require("../models/CourseMaterial");
const Syllabus = require("../models/Syllabus");
const Award = require("../models/Award");
const Blog = require("../models/Blog");
const HeroSlider = require("../models/HeroSlider");
const AboutContent = require("../models/AboutContent");
const { DEFAULT_ABOUT } = require("../controllers/aboutController");
const PlatformSetting = require("../models/PlatformSetting");
const { DEFAULT_SETTINGS } = require("../controllers/settingController");
const HomeVideoSection = require("../models/HomeVideoSection");
const { DEFAULT_VIDEO_SECTION } = require("../controllers/videoSectionController");
const HolidayEmail = require("../models/HolidayEmail");
const Testimonial = require("../models/Testimonial");
const { DEFAULT_TESTIMONIALS } = require("../controllers/testimonialController");
const AlertNotification = require("../models/AlertNotification");
const { DEFAULT_ALERTS } = require("../controllers/alertNotificationController");

User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId", as: "users" });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

Lead.hasMany(LeadNote, { foreignKey: "leadId", as: "notes", onDelete: "CASCADE" });
LeadNote.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });

Lead.hasMany(LeadActivity, { foreignKey: "leadId", as: "timeline", onDelete: "CASCADE" });
LeadActivity.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });

CourseCategory.hasMany(Course, { foreignKey: "categoryId", as: "courses" });
Course.belongsTo(CourseCategory, { foreignKey: "categoryId", as: "category" });

Course.hasMany(CourseModule, { foreignKey: "courseId", as: "modules", onDelete: "CASCADE" });
CourseModule.belongsTo(Course, { foreignKey: "courseId", as: "course" });

CourseModule.hasMany(CourseLesson, { foreignKey: "moduleId", as: "lessons", onDelete: "CASCADE" });
CourseLesson.belongsTo(CourseModule, { foreignKey: "moduleId", as: "module" });

Course.hasMany(Batch, { foreignKey: "courseId", as: "batches" });
Batch.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Student.belongsToMany(Course, {
  through: StudentCourse,
  foreignKey: "studentId",
  otherKey: "courseId",
  as: "enrolledCourses",
});
Course.belongsToMany(Student, {
  through: StudentCourse,
  foreignKey: "courseId",
  otherKey: "studentId",
  as: "enrolledStudents",
});

Student.belongsToMany(Batch, {
  through: StudentBatch,
  foreignKey: "studentId",
  otherKey: "batchId",
  as: "enrolledBatches",
});
Batch.belongsToMany(Student, {
  through: StudentBatch,
  foreignKey: "batchId",
  otherKey: "studentId",
  as: "batchStudents",
});

Course.hasMany(CourseMaterial, { foreignKey: "courseId", as: "materials" });
CourseMaterial.belongsTo(Course, { foreignKey: "courseId", as: "course" });

CourseModule.hasMany(CourseMaterial, { foreignKey: "moduleId", as: "materials", onDelete: "SET NULL" });
CourseMaterial.belongsTo(CourseModule, { foreignKey: "moduleId", as: "module" });

Course.hasMany(Syllabus, { foreignKey: "courseId", as: "syllabusList" });
Syllabus.belongsTo(Course, { foreignKey: "courseId", as: "course" });

const defaultRoles = [
  {
    name: "Super Admin",
    description: "Complete system access and privilege management",
  },
  {
    name: "Admin",
    description: "Institutional management and academic operations",
  },
  {
    name: "Counsellor",
    description: "Lead pipeline, student inquiries, and admissions guidance",
  },
  {
    name: "Accountant",
    description: "Tuition fee collections, invoices, and transaction audits",
  },
  {
    name: "Content Manager",
    description: "Course catalogs, blog articles, and portal content management",
  },
  {
    name: "Student",
    description: "Enrolled learner with access to courses, materials, schedules, and certificates",
  },
];

const defaultPermissions = [
  { name: "dashboard.view", module: "Dashboard", description: "View analytics dashboard" },
  { name: "leads.view", module: "Leads", description: "View lead inquiries" },
  { name: "leads.create", module: "Leads", description: "Create and assign leads" },
  { name: "leads.edit", module: "Leads", description: "Update lead status and notes" },
  { name: "leads.delete", module: "Leads", description: "Delete leads" },
  { name: "students.view", module: "Students", description: "View enrolled student profiles" },
  { name: "students.create", module: "Students", description: "Enroll new students" },
  { name: "students.edit", module: "Students", description: "Update student details" },
  { name: "students.delete", module: "Students", description: "Archive or delete students" },
  { name: "courses.view", module: "Courses", description: "Browse course programs" },
  { name: "courses.create", module: "Courses", description: "Publish new course programs" },
  { name: "courses.edit", module: "Courses", description: "Edit course curriculum and fees" },
  { name: "courses.delete", module: "Courses", description: "Delete course programs" },
  { name: "batches.view", module: "Batches", description: "View active learning batches" },
  { name: "batches.create", module: "Batches", description: "Schedule new batches" },
  { name: "batches.edit", module: "Batches", description: "Modify batch schedule and trainers" },
  { name: "batches.delete", module: "Batches", description: "Cancel or remove batches" },
  { name: "materials.view", module: "Materials", description: "Browse course materials" },
  { name: "materials.create", module: "Materials", description: "Upload course materials" },
  { name: "materials.edit", module: "Materials", description: "Edit course materials" },
  { name: "materials.delete", module: "Materials", description: "Delete course materials" },
  { name: "syllabus.view", module: "Syllabus", description: "View syllabus documents" },
  { name: "syllabus.create", module: "Syllabus", description: "Upload syllabus documents" },
  { name: "syllabus.edit", module: "Syllabus", description: "Update syllabus documents" },
  { name: "syllabus.delete", module: "Syllabus", description: "Delete syllabus documents" },
  { name: "payments.view", module: "Payments", description: "View financial payment records" },
  { name: "payments.create", module: "Payments", description: "Record offline or custom payments" },
  { name: "payments.refund", module: "Payments", description: "Initiate fee refunds" },
  { name: "content.view", module: "Content", description: "View CMS content and blogs" },
  { name: "content.create", module: "Content", description: "Create blog posts and sliders" },
  { name: "content.edit", module: "Content", description: "Update blogs and homepage banners" },
  { name: "content.delete", module: "Content", description: "Delete blog posts and sliders" },
  { name: "settings.view", module: "Settings", description: "View system configurations" },
  { name: "settings.edit", module: "Settings", description: "Update institutional settings" },
  { name: "users.manage", module: "Users", description: "Create and manage staff accounts" },
  { name: "certificates.view", module: "Certificates", description: "View institutional awards and certificates" },
  { name: "certificates.create", module: "Certificates", description: "Add new institutional award or certificate" },
  { name: "certificates.edit", module: "Certificates", description: "Edit institutional awards and certificates" },
  { name: "certificates.delete", module: "Certificates", description: "Delete institutional awards" },
];

const seedDatabase = async () => {
  const roleMap = {};
  for (const roleDef of defaultRoles) {
    const [role] = await Role.findOrCreate({
      where: { name: roleDef.name },
      defaults: roleDef,
    });
    roleMap[role.name] = role;
  }

  const permMap = {};
  for (const permDef of defaultPermissions) {
    const [perm] = await Permission.findOrCreate({
      where: { name: permDef.name },
      defaults: permDef,
    });
    permMap[perm.name] = perm;
  }

  const superAdminRole = roleMap["Super Admin"];
  const allPerms = Object.values(permMap);
  if (superAdminRole && allPerms.length > 0) {
    await superAdminRole.setPermissions(allPerms);
  }

  const adminRole = roleMap["Admin"];
  if (adminRole) {
    const adminPerms = allPerms.filter((p) => p.name !== "users.manage");
    await adminRole.setPermissions(adminPerms);
  }

  const counsellorRole = roleMap["Counsellor"];
  if (counsellorRole) {
    const counsellorPerms = allPerms.filter(
      (p) =>
        p.name.startsWith("leads.") ||
        p.name === "students.view" ||
        p.name === "courses.view" ||
        p.name === "dashboard.view"
    );
    await counsellorRole.setPermissions(counsellorPerms);
  }

  const accountantRole = roleMap["Accountant"];
  if (accountantRole) {
    const accountantPerms = allPerms.filter(
      (p) =>
        p.name.startsWith("payments.") ||
        p.name === "students.view" ||
        p.name === "dashboard.view"
    );
    await accountantRole.setPermissions(accountantPerms);
  }

  const contentRole = roleMap["Content Manager"];
  if (contentRole) {
    const contentPerms = allPerms.filter(
      (p) =>
        p.name.startsWith("content.") ||
        p.name.startsWith("materials.") ||
        p.name.startsWith("syllabus.") ||
        p.name === "courses.view" ||
        p.name === "dashboard.view"
    );
    await contentRole.setPermissions(contentPerms);
  }

  const studentRole = roleMap["Student"];
  if (studentRole) {
    const studentPerms = allPerms.filter(
      (p) =>
        p.name === "courses.view" ||
        p.name === "batches.view" ||
        p.name === "materials.view" ||
        p.name === "syllabus.view" ||
        p.name === "content.view"
    );
    await studentRole.setPermissions(studentPerms);
  }

  const superAdminEmail = process.env.SUPERADMIN_EMAIL || "admin@apnavidya.com";
  const existingSuperAdmin = await User.findOne({ where: { email: superAdminEmail } });

  if (!existingSuperAdmin && superAdminRole) {
    await User.create({
      name: process.env.SUPERADMIN_NAME || "Super Admin",
      email: superAdminEmail,
      phone: "+91 98765 43210",
      password: process.env.SUPERADMIN_PASSWORD || "Admin@12345",
      roleId: superAdminRole.id,
      status: "Active",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    });
    console.log(`Initial Super Admin created: ${superAdminEmail}`);
  }







  const aboutCount = await AboutContent.count();
  if (aboutCount === 0) {
    await AboutContent.create(DEFAULT_ABOUT);
  }

  const settingCount = await PlatformSetting.count();
  if (settingCount === 0) {
    await PlatformSetting.create(DEFAULT_SETTINGS);
  }

  const videoCount = await HomeVideoSection.count();
  if (videoCount === 0) {
    await HomeVideoSection.create(DEFAULT_VIDEO_SECTION);
  }

  const testimonialCount = await Testimonial.count();
  if (testimonialCount === 0) {
    for (const item of DEFAULT_TESTIMONIALS) {
      await Testimonial.create(item);
    }
  }

  const alertCount = await AlertNotification.count();
  if (alertCount === 0) {
    for (const item of DEFAULT_ALERTS) {
      await AlertNotification.create(item);
    }
  }
};

const initDb = async () => {
  try {
    await sequelize.sync();
    try {
      await sequelize.query(
        "ALTER TABLE students ADD COLUMN registrationNumber VARCHAR(50) NULL"
      );
    } catch (e) {}
    try {
      await sequelize.query(
        "UPDATE students SET registrationNumber = CONCAT('AV-STU-', LPAD(id, 4, '0')) WHERE registrationNumber IS NULL OR registrationNumber = ''"
      );
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE users ADD COLUMN bio TEXT NULL");
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE users ADD COLUMN designation VARCHAR(150) NULL");
    } catch (e) {}
    try {
      await sequelize.query(
        "ALTER TABLE courses MODIFY COLUMN level VARCHAR(50) DEFAULT 'Beginner to Advanced'"
      );
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE courses ADD COLUMN syllabusUrl TEXT NULL");
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE home_video_sections ADD COLUMN videos JSON NULL");
    } catch (e) {}
    try {
      await sequelize.query(
        "UPDATE blogs SET excerpt = SUBSTRING(REPLACE(REPLACE(content, '<p>', ''), '</p>', ' '), 1, 240) WHERE excerpt IS NULL OR excerpt = ''"
      );
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE alert_notifications ADD COLUMN bgColor VARCHAR(50) DEFAULT '#FD8006'");
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE alert_notifications ADD COLUMN textColor VARCHAR(50) DEFAULT '#ffffff'");
    } catch (e) {}
    try {
      await sequelize.query("ALTER TABLE about_contents ADD COLUMN valuesSubtitle TEXT NULL");
    } catch (e) {}
    console.log("Database models synchronized successfully.");
    await seedDatabase();
    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Database initialization error:", err);
    throw err;
  }
};

module.exports = {
  initDb,
  User,
  Role,
  Permission,
  RolePermission,
  Lead,
  LeadNote,
  LeadActivity,
  Student,
  StudentCourse,
  StudentBatch,
  CourseCategory,
  Course,
  CourseModule,
  CourseLesson,
  Batch,
  CourseMaterial,
  Syllabus,
  Award,
  Blog,
  HeroSlider,
  AboutContent,
  PlatformSetting,
  HomeVideoSection,
  HolidayEmail,
  Testimonial,
  AlertNotification,
};
